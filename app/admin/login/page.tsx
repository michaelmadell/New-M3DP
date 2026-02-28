"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const next = searchParams.get("next") ?? "/admin";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(
    error === "misconfigured"
      ? "Admin is not configured (missing env vars)."
      : null
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, next }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok: true; redirectTo: string }
        | { ok: false; error?: string }
        | null;

      if (!res.ok || !data || data.ok === false) {
        setMessage(data && "error" in data ? data.error ?? "Login failed" : "Login failed");
        return;
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch {
      setMessage("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="mb-6">
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN ]
          </div>
          <h1 className="text-2xl font-bold mt-2 text-[var(--color-fg)]">
            Sign in
          </h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            Sign in with your admin account.
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-[var(--analog-amber)] bg-[var(--analog-amber)]/10 p-3 text-sm text-[var(--color-fg)]">
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
              Email
            </label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
              Password
            </label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            variant="digital"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}