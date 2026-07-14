"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const CURRENCY = (process.env.DONATION_CURRENCY || "usd").toLowerCase();
const MIN = 1;
const MAX = 100000;

export async function startDonation(formData: FormData) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) redirect("/donate?error=unconfigured");

  const optionId = String(formData.get("option") || "");
  const customRaw = String(formData.get("custom_amount") || "").replace(/[^0-9.]/g, "");

  let amount: number | null = null;
  let title = "Donation";
  let description = "Supporting Vaidyalaya Seva hospital infrastructure projects";

  if (optionId && optionId !== "other") {
    const supabase = await createClient();
    const { data: opt } = await supabase
      .from("donation_options")
      .select("title, description, amount")
      .eq("id", optionId)
      .eq("active", true)
      .maybeSingle();
    if (!opt) redirect("/donate?error=invalid");
    title = opt.title;
    if (opt.description) description = opt.description;
    amount = opt.amount != null ? Number(opt.amount) : null;
  }
  if (amount == null) {
    amount = Math.round(Number(customRaw) * 100) / 100;
  }
  if (!Number.isFinite(amount) || amount < MIN || amount > MAX) {
    redirect("/donate?error=amount");
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.vaidyalayaseva.org";
  const params = new URLSearchParams({
    mode: "payment",
    submit_type: "donate",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": CURRENCY,
    "line_items[0][price_data][unit_amount]": String(Math.round(amount * 100)),
    "line_items[0][price_data][product_data][name]": `${title} – Vaidyalaya Seva`,
    "line_items[0][price_data][product_data][description]": description.slice(0, 300),
    success_url: `${site}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/donate?canceled=1`,
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const session = await res.json();
  if (!res.ok || !session.url) {
    console.error("Stripe checkout session failed:", session?.error?.message);
    redirect("/donate?error=stripe");
  }
  redirect(session.url);
}
