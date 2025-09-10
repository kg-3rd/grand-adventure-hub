import { useEffect, useRef, useState, PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CarouselProps = PropsWithChildren<{
  ariaLabel?: string;
  className?: string;
}>;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function Carousel({ children, ariaLabel = 'Carousel', className = '' }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 0);
    setAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateEdges();
    const onScroll = () => updateEdges();
    el.addEventListener('scroll', onScroll, { passive: true });
    const onResize = () => updateEdges();
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollByAmount = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    const target = clamp(el.scrollLeft + dir * step, 0, el.scrollWidth - el.clientWidth);
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByAmount(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByAmount(1);
    }
  };

  return (
    <div className={`relative ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div
        ref={trackRef}
        className="flex overflow-x-auto overflow-y-visible no-scrollbar scroll-smooth snap-x snap-mandatory gap-6 pb-16 pt-12"
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="group"
        aria-label="Slides"
      >
        {children}
      </div>

      {/* Absolute arrows with responsive negative offsets to sit away from images */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Previous"
        onClick={() => scrollByAmount(-1)}
        disabled={atStart}
        className={`absolute top-1/2 -translate-y-1/2 left-2 sm:-left-8 md:-left-12 lg:-left-14 xl:-left-16 z-10 text-white hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-ring ${
          atStart ? 'opacity-40 cursor-not-allowed' : ''
        }`}
      >
        <ChevronLeft size={32} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Next"
        onClick={() => scrollByAmount(1)}
        disabled={atEnd}
        className={`absolute top-1/2 -translate-y-1/2 right-2 sm:-right-8 md:-right-12 lg:-right-14 xl:-right-16 z-10 text-white hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-ring ${
          atEnd ? 'opacity-40 cursor-not-allowed' : ''
        }`}
      >
        <ChevronRight size={32} />
      </Button>
    </div>
  );
}
