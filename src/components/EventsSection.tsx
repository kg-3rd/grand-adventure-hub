import { useEffect, useState } from 'react';
import { Lightbox } from '@/components/ui/lightbox';
import Carousel from '@/components/carousel/Carousel';
import CarouselItem from '@/components/carousel/CarouselItem';
// removed Calendar, MapPin since we no longer overlay details on the image
import { supabase } from '@/lib/supabase';

const EventsSection = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const [posters, setPosters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventsEntered, setEventsEntered] = useState(false);

  // Helper to apply saved order.json if present
  const applyOrder = (items: { name: string; url: string }[], order?: string[]) => {
    if (!order || !order.length) return items;
    const indexMap = new Map(order.map((n, i) => [n, i] as const));
    return [...items].sort((a, b) => {
      const ai = indexMap.has(a.name) ? (indexMap.get(a.name) as number) : Number.MAX_SAFE_INTEGER;
      const bi = indexMap.has(b.name) ? (indexMap.get(b.name) as number) : Number.MAX_SAFE_INTEGER;
      return ai - bi || a.name.localeCompare(b.name);
    });
  };

  // Fetch event posters from Supabase Storage (public read bucket: events-posters)
  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.storage
          .from('events-posters')
          .list(undefined, { limit: 100, sortBy: { column: 'name', order: 'asc' } });
        if (error) throw error;
        const files = (data || [])
          // filter only images by extension
          .filter((i: any) => /\.(png|jpe?g|webp|gif|svg)$/i.test(i.name));
        // Build items with name+url
        let items = files.map((i: any) => ({
          name: i.name,
          url: supabase.storage.from('events-posters').getPublicUrl(i.name).data.publicUrl,
        }));
        // Try to fetch order.json; ignore errors
        try {
          const { data: orderFile, error: orderErr } = await supabase.storage
            .from('events-posters')
            .download('order.json');
          if (!orderErr && orderFile) {
            const txt = await orderFile.text();
            const parsed = JSON.parse(txt);
            if (Array.isArray(parsed?.order)) {
              items = applyOrder(items, parsed.order as string[]);
            }
          }
        } catch {
          // ignore
        }
        const urls = items.map((i) => i.url);
        if (!isMounted) return;
        setPosters(urls);
        setCurrentPosterIndex(0);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e.message || 'Failed to load posters');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, []);

  const openPosterLightbox = (index: number) => {
    setCurrentPosterIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextPoster = () =>
    setCurrentPosterIndex((prev) => (posters.length ? (prev + 1) % posters.length : 0));
  const prevPoster = () =>
    setCurrentPosterIndex((prev) => (posters.length ? (prev - 1 + posters.length) % posters.length : 0));

  useEffect(() => {
    if (!loading && !error && posters.length > 0) {
      setEventsEntered(true);
    } else {
      setEventsEntered(false);
    }
  }, [loading, error, posters.length]);

  return (
  <section id="events" className="py-24 sm:py-28 lg:py-32 bg-background border-t border-border/20 scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
       <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase text-primary/70 mb-2">Upcoming Adventures</h2>
          {/* <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Upcoming Adventures
          </h2> */}
          <p className="mt-3 text-muted-foreground">
            Trips, festivals, and getaways crafted for explorers like you.
          </p>
        </div>

        {loading && (
          <div className="space-y-6">
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full sm:w-1/2 lg:w-1/3 shrink-0 rounded-3xl border border-border/20 bg-muted/30 p-4 shadow-inner animate-pulse"
                >
                  <div className="aspect-[2/3] w-full rounded-2xl bg-muted/50" />
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && error && (
          <div className="text-center text-sm text-destructive">{error}</div>
        )}
        {!loading && !error && posters.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">No posters yet. Check back soon.</div>
        )}

        {!loading && !error && posters.length > 0 && (
          <div className={`space-y-6 transition-all duration-500 ${eventsEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <Carousel>
              {posters.map((url, index) => (
                <CarouselItem key={url + index}>
                  <button
                    type="button"
                    aria-label={`Open event poster ${index + 1}`}
                    className="group block w-full cursor-pointer"
                    onClick={() => openPosterLightbox(index)}
                  >
                    <div className="relative h-full overflow-visible rounded-3xl border border-border/20 bg-foreground/5 p-4 shadow-adventure transition-all duration-500 hover:-translate-y-1 hover:shadow-cinematic">
                      <div className="relative overflow-hidden rounded-2xl aspect-[2/3] transition-shadow duration-500">
                        <img
                          src={url}
                          alt={`Event poster ${index + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                       
                        <div className="md:hidden pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="absolute bottom-3 right-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm">
                            Tap to view
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </Carousel>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="h-[1px] w-8 bg-border" />
              <span>Swipe to see more</span>
              <span className="h-[1px] w-8 bg-border" />
            </div>
          </div>
        )}

        <Lightbox
          images={posters}
          currentIndex={currentPosterIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onNext={nextPoster}
          onPrev={prevPoster}
        />
      </div>
    </section>
  );
};

export default EventsSection;
