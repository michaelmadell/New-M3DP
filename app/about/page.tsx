import Link from "next/link";
import { Button } from "@/components/Button";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10">
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
          [ ABOUT ]
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mt-2 text-[var(--color-fg)]">
          About Monkeys 3DPrints
        </h1>
        <p className="text-[var(--color-fg)]/70 mt-3 max-w-3xl">
          Where technology meets art—digital fabrication, analog photography, and
          a love of making things.
        </p>
      </div>

      <div className="space-y-10">
        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3 text-[var(--color-fg)]">
            What We Do
          </h2>
          <p className="text-[var(--color-fg)]/75">
            Monkeys 3DPrints is a small business specializing in custom 3D
            printing services and traditional film processing. We combine modern
            technology with classic photography techniques to offer unique
            services to our customers.
          </p>
        </section>

        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-fg)]">
            Our Services
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-fg)]">
                3D Printing Services
              </h3>
              <p className="text-[var(--color-fg)]/75">
                We offer custom 3D printing for replacement parts, custom
                designs, and creative projects. Whether you have a broken item
                that needs recreating or a completely new design, we can bring
                your ideas to life using PLA, ABS, or PETG materials.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-fg)]">
                Film Processing & Scanning
              </h3>
              <p className="text-[var(--color-fg)]/75">
                Our specialized E3 and E4 Ektachrome film development service
                uses careful hand-processing techniques to recover images from
                vintage film. We also offer professional film scanning services
                to digitize your precious memories.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-fg)]">
                Product Reviews
              </h3>
              <p className="text-[var(--color-fg)]/75">
                We review hobbyist maker products including 3D printers, laser
                engravers, and related equipment—helping you make informed
                decisions about your next purchase.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-fg)]">
            Why Choose Us?
          </h2>
          <ul className="space-y-2 text-[var(--color-fg)]/75">
            <li>
              • <span className="font-bold text-[var(--color-fg)]">Quality First:</span>{" "}
              We take pride in every print and every developed roll of film
            </li>
            <li>
              • <span className="font-bold text-[var(--color-fg)]">Fair Pricing:</span>{" "}
              Competitive rates for both individuals and small businesses
            </li>
            <li>
              • <span className="font-bold text-[var(--color-fg)]">Personal Service:</span>{" "}
              Direct communication throughout your project
            </li>
            <li>
              • <span className="font-bold text-[var(--color-fg)]">Technical Expertise:</span>{" "}
              Years of experience in both 3D printing and film photography
            </li>
          </ul>
        </section>

        <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/15 via-[var(--color-surface)] to-[var(--color-secondary)]/10 p-8">
          <h2 className="text-2xl font-bold mb-3 text-[var(--color-fg)]">
            Get In Touch
          </h2>
          <p className="text-[var(--color-fg)]/75 mb-6">
            Ready to start your project? Whether it&apos;s a custom 3D print,
            film processing, or you have questions about our services, we&apos;d
            love to hear from you.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button asChild variant="digital">
              <Link href="/quote">Get a Quote</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}