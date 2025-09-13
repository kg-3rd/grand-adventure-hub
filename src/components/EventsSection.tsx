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

  return (
  <section id="events" className="py-24 sm:py-28 lg:py-32 bg-background border-t border-border/20 scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <div className="text-center text-sm text-muted-foreground">Loading posters…</div>
        )}
        {!loading && error && (
          <div className="text-center text-sm text-destructive">{error}</div>
        )}
        {!loading && !error && posters.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">No posters yet. Check back soon.</div>
        )}

        {!loading && !error && posters.length > 0 && (
          <Carousel>
            {posters.map((url, index) => (
              <CarouselItem key={url + index}>
                <button
                  type="button"
                  aria-label={`Open event poster ${index + 1}`}
                  className="group w-full text-left cursor-pointer"
                  onClick={() => openPosterLightbox(index)}
                >
                  <div className="relative overflow-visible bg-card/20 backdrop-blur-sm p-4 rounded-3xl shadow-cinematic hover:shadow-golden border border-border/20">
                    <div className="relative overflow-hidden rounded-2xl aspect-[2/3] transition-shadow duration-500">
                      <img
                        src={url}
                        alt={`Event poster ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-primary/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Click to View
                      </div>
                    </div>
                  </div>
                </button>
              </CarouselItem>
            ))}
          </Carousel>
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