"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

export default function AdminAccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; error?: string }
        | null;

      if (!res.ok || !data || data.ok === false) {
        const errText =
          data && "error" in data && data.error ? data.error : "Failed to change password";
        setMsg({ type: "err", text: errText });
        return;
      }

      setMsg({ type: "ok", text: "Password updated." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMsg({ type: "err", text: "Failed to change password. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
          [ ADMIN / ACCOUNT ]
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
          Account
        </h1>
        <p className="text-sm text-[var(--color-fg)]/70 mt-2">
          Change your admin password.
        </p>
      </div>

      {msg && (
        <div
          className={[
            "rounded-lg border p-3 text-sm",
            msg.type === "ok"
              ? "border-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10 text-[var(--color-fg)]"
              : "border-[var(--analog-amber)] bg-[var(--analog-amber)]/10 text-[var(--color-fg)]",
          ].join(" ")}
        >
          {msg.text}
        </div>
      )}

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 max-w-xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
              Current password
            </label>
            <input
              type="password"
              required
              className="input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
              New password
            </label>
            <input
              type="password"
              required
              minLength={10}
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <div className="text-xs text-[var(--color-fg)]/50 mt-2">
              Minimum 10 characters.
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
              Confirm new password
            </label>
            <input
              type="password"
              required
              minLength={10}
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" variant="digital" disabled={submitting}>
            {submitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}