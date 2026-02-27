import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)]">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4 bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-lg">
              <div className="w-12 h-12 border-2 border-[var(--digital-cyan)] flex items-center justify-center font-bold text-[var(--digital-cyan)]">
                M3DP
              </div>
              <div className="font-bold text-xl">
                <span className="text-[var(--color-fg)]">Monkeys</span>
                <span className="text-[var(--digital-cyan)]">3DPrints</span>
              </div>
            </div>

            <p className="text-[var(--color-fg)]/80 max-w-md mb-6">
              Professional 3D printing and film processing services. Bridging
              digital fabrication with analog craftsmanship.
            </p>

            <div className="flex gap-4">
              <div className="text-xs text-[var(--color-fg)]/80 flex items-center gap-1">
                <span className="text-[var(--digital-cyan)]">▸</span> UK Based
              </div>
              <div className="text-xs text-[var(--color-fg)]/80 flex items-center gap-1">
                <span className="text-[var(--analog-amber)]">▸</span> Est. 2020
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-[var(--color-fg)]/70 font-bold mb-4 text-sm tracking-wider uppercase">
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/quote" className="text-[var(--color-fg)]/80 hover:text-[var(--digital-cyan)] transition-colors text-sm">
                  3D Printing
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-[var(--color-fg)]/80 hover:text-[var(--digital-cyan)] transition-colors text-sm">
                  Shop Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--color-fg)]/80 hover:text-[var(--analog-amber)] transition-colors text-sm">
                  Film Processing
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-[var(--color-fg)]/80 hover:text-[var(--analog-amber)] transition-colors text-sm">
                  Photography
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-[var(--color-fg)]/70 font-bold mb-4 text-sm tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-[var(--color-fg)]/80 hover:text-[var(--digital-cyan)] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[var(--color-fg)]/80 hover:text-[var(--digital-cyan)] transition-colors text-sm">
                  Blog & Reviews
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--color-fg)]/80 hover:text-[var(--digital-cyan)] transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[var(--color-fg)]/80 hover:text-[var(--digital-cyan)] transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--color-border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--color-fg)]/70 text-center text-sm">
            &copy; {new Date().getFullYear()} Monkeys 3DPrints. All rights reserved.
          </p>
          <div className="flex gap-2 text-xs text-[var(--color-fg)]/70">
            <span className="text-[var(--digital-cyan)]">[</span>
            <span>Newton Abbot, UK</span>
            <span className="text-[var(--digital-cyan)]">]</span>
          </div>
        </div>
      </div>
    </footer>
  );
}