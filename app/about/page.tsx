export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">About Monkeys 3DPrints</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          Where Technology Meets Art
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What We Do</h2>
          <p className="text-gray-700 mb-4">
            Monkeys 3DPrints is a small business specializing in custom 3D printing services 
            and traditional film processing. We combine modern technology with classic photography 
            techniques to offer unique services to our customers.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Services</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">3D Printing Services</h3>
              <p className="text-gray-700">
                We offer custom 3D printing for replacement parts, custom designs, and creative projects. 
                Whether you have a broken item that needs recreating or a completely new design, we can 
                bring your ideas to life using PLA, ABS, or PETG materials.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Film Processing & Scanning</h3>
              <p className="text-gray-700">
                Our specialized E3 and E4 Ektachrome film development service uses careful hand-processing 
                techniques to recover images from vintage film. We also offer professional film scanning 
                services to digitize your precious memories.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Product Reviews</h3>
              <p className="text-gray-700">
                We review hobbyist maker products including 3D printers, laser engravers, and related 
                equipment, helping you make informed decisions about your next purchase.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Quality First:</strong> We take pride in every print and every developed roll of film</li>
            <li>• <strong>Fair Pricing:</strong> Competitive rates for both individuals and small businesses</li>
            <li>• <strong>Personal Service:</strong> Direct communication throughout your project</li>
            <li>• <strong>Technical Expertise:</strong> Years of experience in both 3D printing and film photography</li>
          </ul>
        </section>

        <section className="bg-primary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-700 mb-4">
            Ready to start your project? Whether it's a custom 3D print, film processing, 
            or you have questions about our services, we'd love to hear from you.
          </p>
          <div className="flex space-x-4">
            <a href="/quote" className="btn btn-primary">
              Get a Quote
            </a>
            <a href="/contact" className="btn btn-secondary">
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
