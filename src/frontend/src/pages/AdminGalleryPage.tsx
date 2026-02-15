import { useState, useRef } from 'react';
import { ArrowLeft, Upload, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import LoginButton from '../components/auth/LoginButton';
import { useAdminGuard } from '../hooks/useAdminGuard';
import {
  useListGalleryImages,
  useUploadGalleryImage,
  useDeleteGalleryImage,
} from '../hooks/useGallery';
import { ExternalBlob } from '../backend';

export default function AdminGalleryPage() {
  const { isLoading, isAuthenticated, isAdmin } = useAdminGuard();
  const { data: images, isLoading: imagesLoading, error } = useListGalleryImages();
  const uploadMutation = useUploadGalleryImage();
  const deleteMutation = useDeleteGalleryImage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    window.location.hash = '#/admin/inquiries';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadMutation.mutateAsync({
        id,
        filename: selectedFile.name,
        blob,
        alt: altText || undefined,
      });

      // Reset form
      setSelectedFile(null);
      setAltText('');
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteImageId) return;

    try {
      await deleteMutation.mutateAsync(deleteImageId);
      setDeleteImageId(null);
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Delete failed: ${error.message}`);
    }
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
            <CardDescription>Please sign in to access the gallery management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginButton />
            <Button variant="outline" onClick={handleBack} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
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
                {error?.message || 'Only administrators can access the gallery management.'}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <LoginButton />
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
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
                <h1 className="text-2xl font-bold text-foreground">Gallery Management</h1>
                <p className="text-sm text-muted-foreground">Upload and manage gallery images</p>
              </div>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="section-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>Add a new image to the gallery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-file">Image File</Label>
                  <Input
                    id="image-file"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploadMutation.isPending}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alt-text">Alt Text (Optional)</Label>
                  <Input
                    id="alt-text"
                    placeholder="Describe the image..."
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    disabled={uploadMutation.isPending}
                  />
                </div>

                {uploadMutation.isPending && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uploading...</span>
                      <span className="text-foreground font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                  className="w-full"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>

                {uploadMutation.isSuccess && (
                  <Alert>
                    <AlertDescription>Image uploaded successfully!</AlertDescription>
                  </Alert>
                )}

                {uploadMutation.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Upload failed: {uploadMutation.error?.message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Gallery Images List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Images ({images?.length || 0})</CardTitle>
                <CardDescription>Manage your gallery images</CardDescription>
              </CardHeader>
              <CardContent>
                {imagesLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading images...</p>
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertDescription>Failed to load images: {error.message}</AlertDescription>
                  </Alert>
                ) : !images || images.length === 0 ? (
                  <div className="text-center py-12">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No images yet</p>
                    <p className="text-muted-foreground">
                      Upload your first image to get started
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                      {images.map((image) => (
                        <div
                          key={image.id}
                          className="group relative aspect-[3/2] overflow-hidden rounded-lg border border-border bg-muted"
                        >
                          <img
                            src={image.blob.getDirectURL()}
                            alt={image.alt || image.filename}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                              <p className="text-sm font-medium text-foreground truncate">
                                {image.filename}
                              </p>
                              {image.alt && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {image.alt}
                                </p>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteImageId(image.id)}
                                disabled={deleteMutation.isPending}
                                className="w-full"
                              >
                                <Trash2 className="mr-2 h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteImageId} onOpenChange={() => setDeleteImageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
