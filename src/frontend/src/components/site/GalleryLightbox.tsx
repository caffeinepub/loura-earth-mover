import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GalleryLightboxProps {
  images: Array<{ src: string; alt: string }>;
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function GalleryLightbox({
  images,
  selectedIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  if (selectedIndex === null) return null;

  const currentImage = images[selectedIndex];
  const hasPrevious = selectedIndex > 0;
  const hasNext = selectedIndex < images.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(selectedIndex + 1);
    }
  };

  return (
    <Dialog open={selectedIndex !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-background/95 backdrop-blur">
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {/* Close Button */}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 rounded-full bg-background/80 hover:bg-background"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>

          {/* Previous Button */}
          {hasPrevious && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-4 z-50 rounded-full bg-background/80 hover:bg-background"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {/* Image */}
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-full object-contain rounded-lg"
          />

          {/* Next Button */}
          {hasNext && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 z-50 rounded-full bg-background/80 hover:bg-background"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/80 text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

