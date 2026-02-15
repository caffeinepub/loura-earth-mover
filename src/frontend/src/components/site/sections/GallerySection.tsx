import { useState } from 'react';
import GalleryLightbox from '../GalleryLightbox';
import { useListGalleryImages } from '../../../hooks/useGallery';

const staticGalleryImages = [
  {
    src: '/assets/generated/loura-gallery-1.dim_1200x800.png',
    alt: 'Excavator moving soil on construction site',
  },
  {
    src: '/assets/generated/loura-gallery-2.dim_1200x800.png',
    alt: 'Bulldozer grading land for development',
  },
  {
    src: '/assets/generated/loura-gallery-3.dim_1200x800.png',
    alt: 'Dump truck on active work site',
  },
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { data: uploadedImages, isLoading } = useListGalleryImages();

  // Use uploaded images if available, otherwise fall back to static images
  const galleryImages =
    uploadedImages && uploadedImages.length > 0
      ? uploadedImages.map((img) => ({
          src: img.blob.getDirectURL(),
          alt: img.alt || img.filename,
        }))
      : staticGalleryImages;

  return (
    <section id="gallery" className="section-spacing bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See our equipment and projects in action
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className="group relative aspect-[3/2] overflow-hidden rounded-lg shadow-md hover:shadow-earth transition-all duration-300"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        )}
      </div>

      <GalleryLightbox
        images={galleryImages}
        selectedIndex={selectedImage}
        onClose={() => setSelectedImage(null)}
        onNavigate={setSelectedImage}
      />
    </section>
  );
}
