import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useCreateInquiry } from '../../hooks/useCreateInquiry';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: createInquiry, isPending, isSuccess, isError, error } = useCreateInquiry();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      service: 'exteriorWashing',
      location: formData.location || null,
      message: formData.message,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (isSuccess) {
    return (
      <Alert className="border-accent/50 bg-accent/5">
        <CheckCircle2 className="h-5 w-5 text-accent" />
        <AlertDescription className="ml-2">
          <p className="font-semibold text-foreground mb-2">Thank you for your inquiry!</p>
          <p className="text-muted-foreground">
            We've received your message and will get back to you within 24 hours.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                phone: '',
                service: '',
                location: '',
                message: '',
              });
              window.location.reload();
            }}
            className="mt-4"
          >
            Submit Another Inquiry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {error?.message || 'Failed to submit inquiry. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="John Doe"
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john@example.com"
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="(555) 123-4567"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">
          Service Needed <span className="text-destructive">*</span>
        </Label>
        <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
          <SelectTrigger className={errors.service ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excavation">Excavation</SelectItem>
            <SelectItem value="grading">Land Grading</SelectItem>
            <SelectItem value="hauling">Material Hauling</SelectItem>
            <SelectItem value="clearing">Site Clearing</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.service && <p className="text-sm text-destructive">{errors.service}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Project Location (Optional)</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="City, State"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Project Details <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Tell us about your project..."
          rows={5}
          className={errors.message ? 'border-destructive' : ''}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Inquiry'
        )}
      </Button>
    </form>
  );
}

