import { useState } from 'react';
import { Lightbox } from '@/components/ui/lightbox';
import campingImage from '@/assets/camping-trip.jpg';
import getawayImage from '@/assets/getaway-trip.jpg';
import festivalImage from '@/assets/festival-trip.jpg';
import communityImage1 from '@/assets/community-1.jpg';
import communityImage2 from '@/assets/community-2.jpg';
import heroImage from '@/assets/hero-adventure.jpg';

const GallerySection = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    {
      src: campingImage,
      alt: 'Camping under the stars',
      category: 'Camping',
    },
    {
      src: festivalImage,
      alt: 'Festival adventures',
      category: 'Festivals',
    },
    {
      src: getawayImage,
      alt: 'Mountain getaway',
      category: 'Getaways',
    },
    {
      src: communityImage1,
      alt: 'Community gathering',
      category: 'Community',
    },
    {
      src: heroImage,
      alt: 'Adventure hiking',
      category: 'Adventure',
    },
    {
      src: communityImage2,
      alt: 'Group activities',
      category: 'Community',
    },
  ];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section id="gallery" className="py-32 bg-muted/20 border-t border-border/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Adventure
            <span className="block text-primary"> Gallery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Moments captured from our unforgettable journeys together
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`group cursor-pointer overflow-hidden rounded-2xl shadow-adventure hover:shadow-cinematic transition-all duration-500 hover:-translate-y-2 ${
                index % 4 === 0 || index % 4 === 3 ? 'md:row-span-2' : ''
              }`}
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay text removed as requested */}

                {/* Hover Effect (removed blur to keep image sharp) */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-16">
          <a
            href="/gallery"
            className="inline-block text-primary hover:text-primary/80 text-lg font-medium tracking-wide uppercase transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            View More Adventures
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={galleryImages.map(img => img.src)}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </section>
  );
};

export default GallerySection;