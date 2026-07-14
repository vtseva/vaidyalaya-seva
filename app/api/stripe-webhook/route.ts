import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function verifySignature(payload: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  // Reject events older than 5 minutes (replay protection)
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(v1, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || !serviceKey) {
    console.error("stripe-webhook: missing STRIPE_WEBHOOK_SECRET or SUPABASE_SERVICE_ROLE_KEY");
    return new Response("Not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature") || "";
  const payload = await req.text();
  if (!verifySignature(payload, signature, secret)) {
    return new Response("Invalid signature", { status: 400 });
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(payload);
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = (event.data?.object || {}) as {
      id?: string;
      amount_total?: number;
      currency?: string;
      payment_status?: string;
      customer_details?: { name?: string; email?: string };
    };
    if (s.id && s.payment_status === "paid") {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
        auth: { persistSession: false },
      });
      const { error } = await supabase.from("donations").upsert(
        {
          stripe_session_id: s.id,
          amount: (s.amount_total || 0) / 100,
          currency: (s.currency || "usd").toUpperCase(),
          donor_name: s.customer_details?.name || null,
          donor_email: s.customer_details?.email || null,
          status: "completed",
        },
        { onConflict: "stripe_session_id" }
      );
      if (error) {
        console.error("stripe-webhook: failed to record donation", error.message);
        return new Response("Record failed", { status: 500 });
      }
    }
  }
  return Response.json({ received: true });
}
