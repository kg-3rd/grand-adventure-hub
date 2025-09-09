import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbox } from '@/components/ui/lightbox';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

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
      poster: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=600&fit=crop',
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
      poster: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=600&fit=crop',
    },
    {
      id: 3,
      title: 'Lake Tahoe Retreat',
      date: 'May 20-22, 2024',
      location: 'Lake Tahoe, NV',
      time: '3 Days',
      spots: '5 spots left',
      price: '$329',
      type: 'Getaway',
      gradient: 'from-accent to-primary',
      poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    },
  ];

  const openPosterLightbox = (index: number) => {
    setCurrentPosterIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextPoster = () => {
    setCurrentPosterIndex((prev) => (prev + 1) % events.length);
  };

  const prevPoster = () => {
    setCurrentPosterIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <section id="events" className="py-32 bg-gradient-cinematic">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Upcoming 
            <span className="text-primary"> Events</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Experience the extraordinary. Click any poster to explore the full details of our adventures.
          </p>
        </div>
        
        {/* Poster Wall */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="group cursor-pointer transform hover:-translate-y-4 transition-all duration-700 hover:scale-105"
              onClick={() => openPosterLightbox(index)}
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* Poster Frame */}
              <div className="relative bg-card/20 backdrop-blur-sm p-4 rounded-3xl shadow-cinematic hover:shadow-golden border border-border/20">
                <div className="relative overflow-hidden rounded-2xl aspect-[2/3] group-hover:shadow-2xl transition-shadow duration-500">
                  <img
                    src={event.poster}
                    alt={`${event.title} poster`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Poster Overlay with Event Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-3 py-1 bg-primary/30 backdrop-blur-sm rounded-full text-xs font-medium tracking-wide uppercase">
                          {event.type}
                        </span>
                        <span className="text-xl font-bold text-primary bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                          {event.price}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 leading-tight">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-1 text-sm text-white/90">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="truncate">{event.date}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Click to View Indicator */}
                  <div className="absolute top-4 right-4 bg-primary/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to View
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Events */}
        <div className="text-center">
          <button className="text-primary hover:text-primary/80 text-lg font-medium tracking-wide uppercase transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
            View All Adventures
          </button>
        </div>
      </div>

      {/* Poster Lightbox */}
      <Lightbox
        images={events.map(event => event.poster)}
        currentIndex={currentPosterIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextPoster}
        onPrev={prevPoster}
      />
    </section>
  );
};

export default EventsSection;