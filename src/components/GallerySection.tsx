import { useCallback, useEffect, useRef, useState } from 'react';
import { Lightbox } from '@/components/ui/lightbox';
import { supabase } from '@/lib/supabase';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const GallerySection = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  type GMedia = { name: string; url: string };
  const [images, setImages] = useState<GMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [galleryEntered, setGalleryEntered] = useState(false);

  // Helper to apply saved order from order.json if present
  const applyOrder = (items: GMedia[], order?: string[]) => {
    if (!order || !order.length) return items;
    const idx = new Map(order.map((n, i) => [n, i] as const));
    return [...items].sort((a, b) => {
      const ai = idx.has(a.name) ? (idx.get(a.name) as number) : Number.MAX_SAFE_INTEGER;
      const bi = idx.has(b.name) ? (idx.get(b.name) as number) : Number.MAX_SAFE_INTEGER;
      return ai - bi || a.name.localeCompare(b.name);
    });
  };

  // Fetch gallery images from Supabase Storage (public read bucket: gallery)
  const loadGallery = useCallback(async () => {
    let aborted = false;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.storage
        .from('gallery')
        .list(undefined, { limit: 100, sortBy: { column: 'name', order: 'asc' } });
      if (error) throw error;
      const files = (data || [])
        .filter((i: any) => i.name !== 'order.json' && /\.(png|jpe?g|webp|gif|svg|mp4|webm|mov|m4v)$/i.test(i.name));
      let items: GMedia[] = files.map((i: any) => ({
        name: i.name,
        url: supabase.storage.from('gallery').getPublicUrl(i.name).data.publicUrl,
      }));
      try {
        // Cache-bust order.json by appending version param (localStorage) to avoid CDN caching
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

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  // Listen for order updates broadcast from admin (localStorage event)
  useEffect(() => {
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'galleryOrderVersion') loadGallery();
    };
    const customHandler = () => loadGallery();
    window.addEventListener('storage', storageHandler);
    window.addEventListener('gallery-order-updated', customHandler as EventListener);
    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('gallery-order-updated', customHandler as EventListener);
    };
  }, [loadGallery]);

  // Derived list of only image (non-video) media for lightbox operations
  const previewItems = images.slice(0, 8);
  const filteredImages = previewItems.filter(i => !/\.mp4|\.webm|\.mov|\.m4v$/i.test(i.name));

  const formatLabel = (name: string) =>
    name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();

  const openLightbox = (name: string) => {
    const idx = filteredImages.findIndex(i => i.name === name);
    if (idx >= 0) {
      setCurrentImageIndex(idx);
      setLightboxOpen(true);
    }
  };

  // Pause other videos when one starts
  const handlePlay = (id: string) => {
    Object.entries(videoRefs.current).forEach(([key, vid]) => {
      if (key !== id && vid && !vid.paused) vid.pause();
    });
    setPlayingId(id);
    const vid = videoRefs.current[id];
    if (vid && vid.paused) {
      vid.play().catch(() => {});
    }
  };

  const handlePause = (id: string) => {
    const current = videoRefs.current[id];
    if (current && current.paused) setPlayingId((p) => (p === id ? null : p));
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (filteredImages.length ? (prev + 1) % filteredImages.length : 0));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (filteredImages.length ? (prev - 1 + filteredImages.length) % filteredImages.length : 0));
  };

  useEffect(() => {
    if (!loading && !error && previewItems.length > 0) {
      setGalleryEntered(true);
    } else {
      setGalleryEntered(false);
    }
  }, [loading, error, previewItems.length]);

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
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-flow-col auto-cols-[78%] sm:auto-cols-[55%] gap-4 overflow-hidden pb-6 -mx-6 px-6 sm:px-0 lg:grid-flow-row lg:grid-cols-4 lg:grid-rows-2 lg:gap-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-full w-full rounded-3xl bg-muted/40">
                  <div className="aspect-[4/3] w-full rounded-3xl bg-muted/60" />
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && error && (
          <div className="text-center text-sm text-destructive">{error}</div>
        )}
        {!loading && !error && images.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">No gallery images yet. Check back soon.</div>
        )}

        {/* Masonry Grid */}
        {!loading && !error && images.length > 0 && (
          <div className={`max-w-7xl mx-auto transition-all duration-500 ${galleryEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {/* Responsive collage: swipeable strip on mobile, airy 2-row grid on desktop */}
            <div className="grid grid-flow-col auto-cols-[78%] sm:auto-cols-[55%] gap-4 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 sm:px-0 lg:grid-flow-row lg:grid-cols-4 lg:grid-rows-2 lg:overflow-visible lg:gap-6 transition-all duration-500">
        {previewItems.map((img) => (
                <div
          key={img.name}
          className="group relative h-full snap-start text-left cursor-pointer"
          aria-label={`Open gallery media ${img.name}`}
          onClick={() => { if (!/\.mp4|\.webm|\.mov|\.m4v$/i.test(img.name)) openLightbox(img.name); }}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-foreground/5 ring-1 ring-border/30 shadow-adventure transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-cinematic">
                    <AspectRatio ratio={4/3}>
                      {/\.mp4|\.webm|\.mov|\.m4v$/i.test(img.name) ? (
                        <div className="relative w-full h-full bg-black">
                          <video
                            ref={(el) => { videoRefs.current[img.name] = el; }}
                            src={img.url}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
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
                          alt={img.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                          loading="lazy"
                        />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {/* <div className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground shadow-sm backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span>{formatLabel(img.name)}</span>
                      </div> */}
                    </AspectRatio>
                  </div>
                </div>
              ))}
            </div>
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
        images={filteredImages.map(i => i.url)}
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
