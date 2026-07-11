"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Invalid email or password.");
      setPending(false);
      return;
    }
    router.push(params.get("next") || "/dashboard");
    router.refresh();
  }

  async function handleReset() {
    if (!email) { setError("Enter your email first, then choose reset."); return; }
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` });
    setResetSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50 px-4">
      <div className="card p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Image src="/images/logo-vikasa-tarangini.png" alt="Vikasa Tarangini logo" width={48} height={48} />
          <Image src="/images/logo-vt-seva.png" alt="VT Seva logo" width={58} height={45} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">Team Login</h1>
        <p className="text-sm text-gray-600 text-center mb-6">For Vaidyalaya Seva administrators and content providers.</p>
        {error && <p className="text-red-700 bg-red-50 rounded-lg p-3 text-sm mb-4" role="alert">{error}</p>}
        {resetSent && <p className="text-green-800 bg-green-50 rounded-lg p-3 text-sm mb-4" role="status">If an account exists for that email, a reset link has been sent.</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <button onClick={handleReset} className="text-primary-800 hover:underline py-2">Forgot password?</button>
          <Link href="/" className="text-gray-500 hover:underline py-2">← Back to website</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
