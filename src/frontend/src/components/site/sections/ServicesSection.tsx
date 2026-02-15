import { Hammer, Mountain, Truck, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  {
    icon: Hammer,
    title: 'Excavation',
    description: 'Precision digging and trenching for foundations, utilities, and drainage systems with expert operators and modern equipment.',
  },
  {
    icon: Mountain,
    title: 'Land Grading',
    description: 'Professional site preparation and leveling to ensure proper drainage and a solid foundation for your construction project.',
  },
  {
    icon: Truck,
    title: 'Material Hauling',
    description: 'Efficient transportation of soil, gravel, and construction materials with our fleet of reliable dump trucks.',
  },
  {
    icon: Wrench,
    title: 'Site Clearing',
    description: 'Complete land clearing services including brush removal, tree clearing, and debris hauling to prepare your site.',
  },
];

export default function ServicesSection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="services" className="section-spacing bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive earthmoving solutions tailored to your project needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="border-border hover:shadow-earth transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={scrollToContact}
            className="text-accent hover:text-accent/80 font-medium inline-flex items-center gap-2 transition-colors"
          >
            Request a quote for your project
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

