import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Lightbox } from '@/components/ui/lightbox';
import campingImage from '@/assets/camping-trip.jpg';
import getawayImage from '@/assets/getaway-trip.jpg';
import festivalImage from '@/assets/festival-trip.jpg';
import communityImage1 from '@/assets/community-1.jpg';
import communityImage2 from '@/assets/community-2.jpg';
import heroImage from '@/assets/hero-adventure.jpg';

const GalleryPage = () => {
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    { src: campingImage, alt: 'Camping under the stars', category: 'Camping' },
    { src: festivalImage, alt: 'Festival adventures', category: 'Festivals' },
    { src: getawayImage, alt: 'Mountain getaway', category: 'Getaways' },
    { src: communityImage1, alt: 'Community gathering', category: 'Community' },
    { src: heroImage, alt: 'Adventure hiking', category: 'Adventure' },
    { src: communityImage2, alt: 'Group activities', category: 'Community' },
  ];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-6 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-foreground hover:text-primary transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
        </div>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Adventure
            <span className="block text-primary"> Gallery</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Explore more moments from our unforgettable journeys together
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Open ${image.alt}`}
              onClick={() => openLightbox(index)}
              className={`group cursor-pointer overflow-hidden rounded-2xl shadow-adventure hover:shadow-cinematic transition-all duration-500 hover:-translate-y-2 text-left ${
                index % 4 === 0 || index % 4 === 3 ? 'sm:row-span-2' : ''
              }`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay text removed as requested */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </button>
          ))}
        </div>
  </div>
      </main>

      <Lightbox
        images={images.map((i) => i.src)}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex((p) => (p + 1) % images.length)}
        onPrev={() => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length)}
      />
    </div>
  );
};

export default GalleryPage;