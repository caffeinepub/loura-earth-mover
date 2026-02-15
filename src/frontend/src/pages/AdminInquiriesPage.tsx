import { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import LoginButton from '../components/auth/LoginButton';
import { useAdminGuard } from '../hooks/useAdminGuard';
import { useListInquiries } from '../hooks/useInquiries';
import type { Inquiry } from '../backend';

export default function AdminInquiriesPage() {
  const { isLoading, isAuthenticated, isAdmin } = useAdminGuard();
  const { data: inquiries, isLoading: inquiriesLoading, error } = useListInquiries();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const handleBack = () => {
    window.location.hash = '#home';
  };

  const handleGalleryNav = () => {
    window.location.hash = '#/admin/gallery';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>Please sign in to access the inquiries dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginButton />
            <Button variant="outline" onClick={handleBack} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {error?.message || 'Only administrators can access the inquiries dashboard.'}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <LoginButton />
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin view
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="section-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Inquiries Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage customer inquiries</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleGalleryNav}>
                <ImageIcon className="mr-2 h-4 w-4" />
                Gallery
              </Button>
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="section-container py-8">
        {inquiriesLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading inquiries...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load inquiries: {error.message}
            </AlertDescription>
          </Alert>
        ) : !inquiries || inquiries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No inquiries yet</p>
              <p className="text-muted-foreground">
                Customer inquiries will appear here when they submit the contact form.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inquiries List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>All Inquiries ({inquiries.length})</CardTitle>
                  <CardDescription>Click to view details</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2 p-4">
                      {inquiries.map((inquiry) => (
                        <button
                          key={inquiry.id.toString()}
                          onClick={() => setSelectedInquiry(inquiry)}
                          className={`w-full text-left p-4 rounded-lg border transition-colors ${
                            selectedInquiry?.id === inquiry.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium text-foreground">{inquiry.name}</p>
                            <Badge variant={inquiry.status === 'pending' ? 'default' : 'secondary'}>
                              {inquiry.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{inquiry.email}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(Number(inquiry.timestamp) / 1000000).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Inquiry Detail */}
            <div className="lg:col-span-2">
              {selectedInquiry ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{selectedInquiry.name}</CardTitle>
                        <CardDescription>Inquiry #{selectedInquiry.id.toString()}</CardDescription>
                      </div>
                      <Badge variant={selectedInquiry.status === 'pending' ? 'default' : 'secondary'}>
                        {selectedInquiry.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`mailto:${selectedInquiry.email}`}
                            className="text-accent hover:underline"
                          >
                            {selectedInquiry.email}
                          </a>
                        </div>
                        {selectedInquiry.phone && (
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`tel:${selectedInquiry.phone}`}
                              className="text-accent hover:underline"
                            >
                              {selectedInquiry.phone}
                            </a>
                          </div>
                        )}
                        {selectedInquiry.location && (
                          <div className="flex items-center gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{selectedInquiry.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {new Date(Number(selectedInquiry.timestamp) / 1000000).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Service Requested */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Service Requested</h3>
                      <Badge variant="outline">{selectedInquiry.service}</Badge>
                    </div>

                    <Separator />

                    {/* Message */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Project Details</h3>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                          {selectedInquiry.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      Select an inquiry
                    </p>
                    <p className="text-muted-foreground">
                      Choose an inquiry from the list to view its details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
