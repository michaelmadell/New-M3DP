import Link from 'next/link'
import Image from 'next/image'

//bg-gradient-to-br from-[#0F1117] via-[#1A1D29] to-[#0F1117]

export default function Home() {
  return (
    <div suppressHydrationWarning className="overflow-hidden">
      {/* Hero Section - Asymmetric split design */}
      <section className="relative min-h-screen flex items-center tech-grid">
        <div className="absolute top-0 left-0 w-full h-full  opacity-90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Text content */}
            <div className="space-y-8 opacity-0 animate-fade-in">
              <div className="inline-block">
                <div className="text-[var(--digital-cyan)] text-sm font-bold tracking-[0.3em] mb-4">
                  [ PRECISION × CRAFT ]
                </div>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-[var(--color-foreground)]">Monkeys</span>
                <span className="block bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                  3DPrints
                </span>
              </h1>
              
              <p className="text-xl text-[var(--color-secondary-foreground)] leading-relaxed max-w-lg">
                Where <span className="text-[var(--color-primary)] font-bold">digital fabrication</span> meets{' '}
                <span className="text-[var(--color-secondary)] font-bold">analog artistry</span>.
                Custom 3D printing, film processing, and creative services.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/quote" className="btn btn-digital">
                  Get Custom Quote
                </Link>
                <Link href="/shop" className="btn btn-analog">
                  Browse Shop
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#2D3142]">
                <div>
                  <div className="text-3xl font-bold text-[var(--digital-cyan)]">50+</div>
                  <div className="text-sm text-[var(--color-muted)] mt-1">Projects Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[var(--analog-amber)]">12/7</div>
                  <div className="text-sm text-[var(--color-muted)] mt-1">Quote Response</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[var(--digital-cyan)]">UK</div>
                  <div className="text-sm text-[var(--color-muted)] mt-1">Based & Made</div>
                </div>
              </div>
            </div>
            
            {/* Right side - Visual element */}
            <div className="relative lg:h-[600px] opacity-0 animate-fade-in delay-200">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/60 to-[var(--color-secondary)]/40 blur-xl"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="backdrop-blur-3xl bg-[var(--color-secondary)]/20 w-full h-full flex items-center justify-center border-2 border-[var(--color-primary)]/30">
                  <div className="text-center  space-y-4 p-8">
                    <div className="text-8xl">🔧</div>
                    <div className="text-2xl font-bold text-[var(--color-primary)]">[ MAKER SPACE ]</div>
                    <div className="text-sm text-[var(--color-fg)]">Digital → Physical</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--color-primary)] to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* Services Section - Diagonal split layout */}
      <section className="relative py-24 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title rounded-lg bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] bg-clip-text text-transparent">[ SERVICES ]</h2>
            <p className="text-[var(--color-primary-foreground)] text-lg mt-4 max-w-2xl mx-auto">
              Bridging the gap between digital precision and analog craftsmanship
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-0">
            {/* 3D Printing - Digital */}
            <div className="card border-r-0 lg:border-r bg-[var(--color-surface-2)] border-[var(--color-border)] group opacity-0 animate-fade-in delay-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-[var(--color-secondary)]/10 flex items-center justify-center text-3xl border-2 border-[var(--color-secondary)]">
                  <span className="text-[var(--color-secondary)]">3D</span>
                </div>
                <div>
                  <div className="text-s text-[var(--color-secondary)] font-bold tracking-widest mb-1">DIGITAL</div>
                  <h3 className="text-3xl font-bold">Custom 3D Printing</h3>
                </div>
              </div>
              
              <div className="space-y-4 text-[var(--color-primary-foreground)] mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-[var(--color-primary)] mt-1">▸</span>
                  <div>
                    <span className="font-bold text-[var(--color-fg)]">Precision Manufacturing:</span> From CAD models to physical reality
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--color-primary)] mt-1">▸</span>
                  <div>
                    <span className="font-bold text-[var(--color-fg)]">Material Options:</span> PLA, ABS, PETG for different applications
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--color-primary)] mt-1">▸</span>
                  <div>
                    <span className="font-bold text-[var(--color-fg)]">File Support:</span> STL, OBJ, 3MF, STEP, engineering drawings
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--color-primary)] mt-1">▸</span>
                  <div>
                    <span className="font-bold text-[var(--color-fg)]">Replacement Parts:</span> Recreate broken or missing components
                  </div>
                </div>
              </div>
              
              <Link href="/quote" className="btn btn-digital">
                Request Quote
              </Link>
            </div>

            {/* Film Processing - Analog */}
            <div className="card group bg-[var(--color-surface-2)] border-[var(--color-border)] opacity-0 animate-fade-in delay-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-[var(--analog-amber)]/10 flex items-center justify-center text-3xl border-2 border-[var(--analog-amber)]">
                  <span className="text-[var(--analog-amber)]">📷</span>
                </div>
                <div>
                  <div className="text-s text-[var(--analog-amber)] font-bold tracking-widest mb-1">ANALOG</div>
                  <h3 className="text-3xl font-bold">Film Processing</h3>
                </div>
              </div>
              
              <div className="space-y-4 text-[var(--color-primary-foreground)] mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-[var(--analog-amber)] mt-1">▸</span>
                  <div>
                    <span className="font-bold text-[var(--color-fg)]">Specialist Development:</span> E3 & E4 Ektachrome slide film
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--analog-amber)] mt-1">▸</span>
                  <div>
                    <span className="font-bold text-[var(--color-fg)]">Hand Processing:</span> Careful recovery of vintage images
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--analog-amber)] mt-1">▸</span>
                  <div>
                    <span className="font-bold text-[var(--color-fg)]">Film Scanning:</span> High-quality digital conversion
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--analog-amber)] mt-1">▸</span>
                  <div>
                    <span className="font-bold text-[var(--color-fg)]">Archival Quality:</span> Preserve your memories professionally
                  </div>
                </div>
              </div>
              
              <Link href="/contact" className="btn btn-analog bg-[var(--analog-amber)]/40 text-[var(--color-secondary-foreground)] hover:bg-[var(--analog-amber)] hover:shadow-lg transition-all shadow-[0_4px_6px_-1px_rgba(var(--analog-amber),0.1),0_2px_4px_-1px_rgba(var(--analog-amber),0.06)]">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview - Masonry style */}
      <section className="py-24 tech-grid relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-title">[ PORTFOLIO ]</h2>
              <p className="text-[var(--color-primary-foreground)] mt-2">Digital & Film Photography</p>
            </div>
            <Link href="/gallery" className="text-[var(--digital-cyan)] hover:text-[var(--analog-amber)] transition-colors font-bold tracking-wider border-[var(--digital-cyan)] border-2 p-2 bg-[var(--digital-cyan)]/10 rounded-lg hover:bg-[var(--analog-amber)]/20 hover:border-[var(--analog-amber)]">
              VIEW ALL →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div 
                key={i} 
                className={`bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-[var(--digital-cyan)] transition-all cursor-pointer group ${
                  i === 1 || i === 6 ? 'lg:row-span-2' : ''
                } ${i % 2 === 0 ? 'opacity-0 animate-fade-in delay-100' : 'opacity-0 animate-fade-in delay-200'}`}
                style={{ aspectRatio: i === 1 || i === 6 ? '1/2' : '1/1' }}
              >
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                  {i % 3 === 0 ? '🎞️' : i % 2 === 0 ? '📸' : '🖼️'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold and centered */}
      <section className="relative py-32 bg-gradient-to-br from-[var(--tech-slate)]/60 to-[var(--warm-cream)]/60 text-[var(--color-primary-foreground)] text-center overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-50"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-in">
            Ready to <span className="bg-[var(--analog-amber)] bg-clip-text text-transparent ">Create</span>?
          </h2>
          <p className="text-2xl mb-8 opacity-0 animate-fade-in delay-100">
            Upload your 3D model for an instant quote, or get in touch to discuss your film processing needs.
          </p>
          <div className="flex flex-wrap justify-center gap-6 opacity-0 animate-fade-in delay-200">
            <Link href="/quote" className="btn btn-digital text-lg px-8 py-4">
              Get 3D Print Quote
            </Link>
            <Link href="/contact" className="btn btn-outline text-lg px-8 py-4">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}