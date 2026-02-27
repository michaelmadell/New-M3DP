"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8">
          <div className="text-[var(--digital-cyan)] text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-3 text-[var(--color-fg)]">
            Message Sent!
          </h2>
          <p className="text-[var(--color-fg)]/70 mb-6">
            Thank you for contacting us. We'll get back to you as soon as possible.
          </p>

          <Button variant="digital" onClick={() => setSubmitted(false)}>
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10">
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
          [ CONTACT ]
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mt-2 text-[var(--color-fg)]">
          Contact Us
        </h1>
        <p className="text-[var(--color-fg)]/70 mt-3 max-w-3xl">
          Have questions about our services or need help with an order? Fill out the
          form and we’ll get back to you soon.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 h-fit">
          <h2 className="text-sm font-bold tracking-wider uppercase text-[var(--color-fg)]/80 mb-5">
            Info
          </h2>

          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-[var(--color-fg)]/90 mb-1">Email</h3>
              <p className="text-[var(--color-fg)]/70">info@monkeys3dprints.co.uk</p>
            </div>

            <div>
              <h3 className="font-bold text-[var(--color-fg)]/90 mb-1">
                Business Hours
              </h3>
              <p className="text-[var(--color-fg)]/70">
                Monday – Friday: 9:00 AM – 5:00 PM
              </p>
              <p className="text-[var(--color-fg)]/70">Saturday – Sunday: Closed</p>
            </div>

            <div>
              <h3 className="font-bold text-[var(--color-fg)]/90 mb-1">
                Response Time
              </h3>
              <p className="text-[var(--color-fg)]/70">
                We typically respond within 24 hours during business days.
              </p>
            </div>

            <div className="pt-2">
              <Button asChild variant="outline">
                <a href="mailto:info@monkeys3dprints.co.uk">Email us directly</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6"
          >
            <div>
              <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
                Name <span className="text-[var(--analog-amber)]">*</span>
              </label>
              <input
                type="text"
                required
                className="input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
                Email <span className="text-[var(--analog-amber)]">*</span>
              </label>
              <input
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
                Subject <span className="text-[var(--analog-amber)]">*</span>
              </label>
              <input
                type="text"
                required
                className="input"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
                Message <span className="text-[var(--analog-amber)]">*</span>
              </label>
              <textarea
                rows={6}
                required
                className="input"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <Button
              type="submit"
              variant="digital"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}