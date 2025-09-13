import { useEffect, useState } from 'react';
import { Lightbox } from '@/components/ui/lightbox';
import { supabase } from '@/lib/supabase';

const GallerySection = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gallery images from Supabase Storage (public read bucket: gallery)
  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.storage
          .from('gallery')
          .list(undefined, { limit: 100, sortBy: { column: 'name', order: 'asc' } });
        if (error) throw error;
        const files = (data || [])
          .filter((i: any) => /\.(png|jpe?g|webp|gif|svg)$/i.test(i.name));
        const urls = files.map((i: any) =>
          supabase.storage.from('gallery').getPublicUrl(i.name).data.publicUrl
        );
        if (!isMounted) return;
        setImages(urls);
        setCurrentImageIndex(0);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e.message || 'Failed to load gallery');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (images.length ? (prev + 1) % images.length : 0));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (images.length ? (prev - 1 + images.length) % images.length : 0));
  };

  return (
  <section id="gallery" className="py-32 bg-muted/20 border-t border-border/20 scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          {/* <p className="text-xs tracking-[0.2em] uppercase text-primary/70 mb-2">Adventure Gallery</p> */}
          <h2 className="text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase text-primary/70 mb-2">Adventure Gallery</h2>
          {/* <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Adventure
            <span className="block text-primary"> Gallery</span>
          </h2> */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Moments captured from our unforgettable journeys together
          </p>
        </div>

        {/* Loading/Error/Empty States */}
        {loading && (
          <div className="text-center text-sm text-muted-foreground">Loading gallery…</div>
        )}
        {!loading && error && (
          <div className="text-center text-sm text-destructive">{error}</div>
        )}
        {!loading && !error && images.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">No gallery images yet. Check back soon.</div>
        )}

        {/* Masonry Grid */}
        {!loading && !error && images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {images.map((src, index) => (
              <div
                key={src + index}
                className={`group cursor-pointer overflow-hidden rounded-2xl shadow-adventure hover:shadow-cinematic transition-all duration-500 hover:-translate-y-2 ${
                  index % 4 === 0 || index % 4 === 3 ? 'md:row-span-2' : ''
                }`}
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay text removed as requested */}

                  {/* Hover Effect (removed blur to keep image sharp) */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        )}

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
        images={images}
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