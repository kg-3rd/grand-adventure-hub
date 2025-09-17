import { useCallback, useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Lightbox } from '@/components/ui/lightbox';
import { supabase } from '@/lib/supabase';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const GalleryPage = () => {
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  type GMedia = { name: string; url: string };
  const [images, setImages] = useState<GMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);

  const applyOrder = (items: GMedia[], order?: string[]) => {
    if (!order || !order.length) return items;
    const idx = new Map(order.map((n, i) => [n, i] as const));
    return [...items].sort((a, b) => {
      const ai = idx.has(a.name) ? (idx.get(a.name) as number) : Number.MAX_SAFE_INTEGER;
      const bi = idx.has(b.name) ? (idx.get(b.name) as number) : Number.MAX_SAFE_INTEGER;
      return ai - bi || a.name.localeCompare(b.name);
    });
  };

  const load = useCallback(async () => {
    let aborted = false;
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.storage
        .from('gallery')
        .list(undefined, { limit: 200, sortBy: { column: 'name', order: 'asc' } });
      if (error) throw error;
      const files = (data || []).filter((i: any) => i.name !== 'order.json' && /\.(png|jpe?g|webp|gif|svg|mp4|webm|mov|m4v)$/i.test(i.name));
      let items: GMedia[] = files.map((i: any) => ({
        name: i.name,
        url: supabase.storage.from('gallery').getPublicUrl(i.name).data.publicUrl,
      }));
      try {
        const version = localStorage.getItem('galleryOrderVersion') || Date.now().toString();
        const orderPublic = supabase.storage.from('gallery').getPublicUrl('order.json').data.publicUrl;
        const resp = await fetch(orderPublic + `?v=${version}`, { cache: 'no-store' });
        if (resp.ok) {
          const text = await resp.text();
          const parsed = JSON.parse(text);
          const order = Array.isArray(parsed?.order) ? parsed.order : (Array.isArray(parsed) ? parsed : undefined);
          items = applyOrder(items, order);
        }
      } catch {
        // ignore
      }
      if (aborted) return;
      setImages(items);
      setCurrentImageIndex(0);
    } catch (e: any) {
      if (aborted) return;
      setError(e.message || 'Failed to load gallery');
    } finally {
      if (!aborted) setLoading(false);
    }
    return () => { aborted = true; };
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'galleryOrderVersion') load();
    };
    const customHandler = () => load();
    window.addEventListener('storage', storageHandler);
    window.addEventListener('gallery-order-updated', customHandler as EventListener);
    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('gallery-order-updated', customHandler as EventListener);
    };
  }, [load]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'galleryOrderVersion') {
        load();
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [load]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handlePlay = (id: string) => {
    Object.entries(videoRefs.current).forEach(([key, vid]) => {
      if (key !== id && vid && !vid.paused) vid.pause();
    });
    setPlayingId(id);
    const vid = videoRefs.current[id];
    if (vid && vid.paused) vid.play().catch(() => {});
  };

  const handlePause = (id: string) => {
    const current = videoRefs.current[id];
    if (current && current.paused) setPlayingId((p) => (p === id ? null : p));
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
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((img, index) => (
                <div
                  key={img.name + index}
                  aria-label={`Open gallery media ${index + 1}`}
                  className="group text-left w-full cursor-pointer"
                  onClick={() => { if (!/\.mp4|\.webm|\.mov|\.m4v$/i.test(img.name)) openLightbox(index); }}
                >
                  <div className="overflow-hidden rounded-2xl shadow-adventure hover:shadow-cinematic transition-all duration-500">
                    <AspectRatio ratio={4/3}>
                      {/\.mp4|\.webm|\.mov|\.m4v$/i.test(img.name) ? (
                        <div className="relative w-full h-full bg-black">
                          <video
                            ref={(el) => { videoRefs.current[img.name] = el; }}
                            src={img.url}
                            className="w-full h-full object-cover"
                            playsInline
                            preload="metadata"
                            controls={playingId === img.name}
                            onPlay={() => handlePlay(img.name)}
                            onPause={() => handlePause(img.name)}
                            onEnded={() => setPlayingId(null)}
                          />
                          {playingId !== img.name && (
                            <button
                              type="button"
                              aria-label="Play video"
                              onClick={(e) => { e.stopPropagation(); handlePlay(img.name); }}
                              className="absolute inset-0 flex items-center justify-center px-4 py-2 text-white/90 hover:text-white transition-colors bg-black/45 hover:bg-black/55 backdrop-blur-sm"
                            >
                              <svg
                                className="w-14 h-14 drop-shadow-lg translate-x-[2px]"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M8 5v14l11-7L8 5z" />
                              </svg>
                              <span className="sr-only">Play video</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <img
                          src={img.url}
                          alt={`Gallery image ${index + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      )}
                    </AspectRatio>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
  </div>
      </main>

      <Lightbox
        images={images.filter(i => !/\.mp4|\.webm|\.mov|\.m4v$/i.test(i.name)).map(i => i.url)}
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