import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from '../../contact/ContactForm';

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '(555) 123-4567',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@louraearth.com',
  },
  {
    icon: MapPin,
    label: 'Service Area',
    value: 'Tri-State Region',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon-Fri: 7AM-6PM',
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="section-spacing">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to start your project? Contact us for a free consultation and quote.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.label} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {info.label}
                        </p>
                        <p className="text-base font-medium text-foreground">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-6">
              <h4 className="font-semibold text-lg text-foreground mb-3">
                Why Choose Loura?
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Licensed and fully insured</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Free estimates and consultations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Competitive pricing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>On-time project completion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>24/7 emergency services available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

