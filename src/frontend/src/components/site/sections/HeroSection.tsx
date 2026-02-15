import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/loura-hero-bg.dim_1920x1080.png"
          alt="Earth moving equipment at work"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="section-container relative z-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Moving Earth,
            <br />
            <span className="text-accent">Building Futures</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl leading-relaxed">
            Professional earthmoving services for residential, commercial, and industrial projects. 
            With decades of experience and state-of-the-art equipment, we deliver precision and reliability on every job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={scrollToContact} className="text-base">
              Get a Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const element = document.getElementById('services');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-base"
            >
              Our Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

