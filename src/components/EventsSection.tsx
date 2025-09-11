import { useState } from 'react';
import { Lightbox } from '@/components/ui/lightbox';
import Carousel from '@/components/carousel/Carousel';
import CarouselItem from '@/components/carousel/CarouselItem';
// removed Calendar, MapPin since we no longer overlay details on the image
import lesotho from '@/assets/Image.png';

const EventsSection = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);

  const events = [
    {
      id: 1,
      title: 'Rocky Mountain Expedition',
      date: 'March 15-18, 2024',
      location: 'Colorado Rockies',
      time: '4 Days',
      spots: '8 spots left',
      price: '$389',
      type: 'Camping',
      gradient: 'from-primary to-earth',
      poster: lesotho,
    },
    {
      id: 2,
      title: 'Desert Music Festival',
      date: 'April 5-7, 2024',
      location: 'Joshua Tree, CA',
      time: '3 Days',
      spots: '12 spots left',
      price: '$459',
      type: 'Festival',
      gradient: 'from-festival to-accent',
      poster: lesotho,
    },
    {
      id: 3,
      title: 'Lake Tahoe Retreat',
      date: 'May 12-14, 2024',
      location: 'Lake Tahoe, CA',
      time: '3 Days',
      spots: '5 spots left',
      price: '$329',
      type: 'Getaway',
      gradient: 'from-earth to-primary',
      poster: lesotho,
    },
    {
      id: 4,
      title: 'Lake Tahoe Retreat',
      date: 'May 12-14, 2024',
      location: 'Lake Tahoe, CA',
      time: '3 Days',
      spots: '5 spots left',
      price: '$329',
      type: 'Getaway',
      gradient: 'from-earth to-primary',
      poster: lesotho,
    },
  ];

  const openPosterLightbox = (index: number) => {
    setCurrentPosterIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextPoster = () =>
    setCurrentPosterIndex((prev) => (prev + 1) % events.length);
  const prevPoster = () =>
    setCurrentPosterIndex((prev) => (prev - 1 + events.length) % events.length);

  return (
    <section id="events" className="py-24 sm:py-28 lg:py-32 bg-background border-t border-border/20">
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

        <Carousel>
          {events.map((event, index) => (
            <CarouselItem key={event.id}>
              <button
                type="button"
                aria-label={`Open ${event.title}`}
                className="group w-full text-left cursor-pointer"
                onClick={() => openPosterLightbox(index)}
              >
                <div className="relative overflow-visible bg-card/20 backdrop-blur-sm p-4 rounded-3xl shadow-cinematic hover:shadow-golden border border-border/20">
                  <div className="relative overflow-hidden rounded-2xl aspect-[2/3] transition-shadow duration-500">
                    <img
                      src={event.poster}
                      alt={`${event.title} poster`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Poster info overlay removed as requested */}
                    <div className="absolute top-4 right-4 bg-primary/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to View
                    </div>
                  </div>
                </div>
              </button>
            </CarouselItem>
          ))}
        </Carousel>

        <Lightbox
          images={events.map((event) => event.poster)}
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