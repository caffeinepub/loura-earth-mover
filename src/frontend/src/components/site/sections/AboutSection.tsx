import { Award, Shield, Wrench } from 'lucide-react';

const highlights = [
  {
    icon: Shield,
    title: 'Safety First',
    description: 'OSHA-compliant operations with comprehensive safety protocols on every job site.',
  },
  {
    icon: Award,
    title: '25+ Years Experience',
    description: 'Decades of expertise in residential, commercial, and industrial earthmoving.',
  },
  {
    icon: Wrench,
    title: 'Modern Equipment',
    description: 'State-of-the-art machinery maintained to the highest standards for reliability.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-spacing">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built on Trust and Excellence
            </h2>
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              Loura Earth Mover has been the trusted choice for earthmoving services across the region 
              for over two decades. Our commitment to quality, safety, and customer satisfaction has 
              made us a leader in the industry.
            </p>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              From small residential projects to large commercial developments, we bring the same level 
              of professionalism and attention to detail to every job. Our experienced operators and 
              well-maintained fleet ensure your project is completed on time and to specification.
            </p>

            <div className="space-y-6">
              {highlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <div key={highlight.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {highlight.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden shadow-earth">
              <img
                src="/assets/generated/loura-logo.dim_512x512.png"
                alt="Loura Earth Mover"
                className="w-full h-full object-contain p-12 bg-muted/30"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

