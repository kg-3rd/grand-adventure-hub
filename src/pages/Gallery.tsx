import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Lightbox } from '@/components/ui/lightbox';
import { supabase } from '@/lib/supabase';

const GalleryPage = () => {
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.storage
          .from('gallery')
          .list(undefined, { limit: 200, sortBy: { column: 'name', order: 'asc' } });
        if (error) throw error;
        const files = (data || []).filter((i: any) => /\.(png|jpe?g|webp|gif|svg)$/i.test(i.name));
        const urls = files.map((i: any) => supabase.storage.from('gallery').getPublicUrl(i.name).data.publicUrl);
        if (!active) return;
        setImages(urls);
        setCurrentImageIndex(0);
      } catch (e: any) {
        if (!active) return;
        setError(e.message || 'Failed to load gallery');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Navigation /> */}
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-6 mb-6">
          <button
            type="button"
            onClick={() => navigate({ pathname: '/' })}
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

        {loading && (
          <p className="text-center text-muted-foreground">Loading gallery…</p>
        )}
        {!loading && error && (
          <p className="text-center text-destructive">{error}</p>
        )}
        {!loading && !error && images.length === 0 && (
          <p className="text-center text-muted-foreground">No gallery images yet.</p>
        )}
        {!loading && !error && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {images.map((src, index) => (
              <button
                key={src + index}
                type="button"
                aria-label={`Open gallery image ${index + 1}`}
                onClick={() => openLightbox(index)}
                className={`group cursor-pointer overflow-hidden rounded-2xl shadow-adventure hover:shadow-cinematic transition-all duration-500 hover:-translate-y-2 text-left ${
                  index % 4 === 0 || index % 4 === 3 ? 'sm:row-span-2' : ''
                }`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </button>
            ))}
          </div>
        )}
  </div>
      </main>

      <Lightbox
        images={images}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex((p) => (images.length ? (p + 1) % images.length : 0))}
        onPrev={() => setCurrentImageIndex((p) => (images.length ? (p - 1 + images.length) % images.length : 0))}
      />
    </div>
  );
};

export default GalleryPage;