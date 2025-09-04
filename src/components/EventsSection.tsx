import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const EventsSection = () => {
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
    },
  ];

  return (
    <section id="events" className="py-20 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upcoming 
            <span className="text-festival"> Events</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready for your next adventure? Check out our upcoming trips and secure your spot 
            before they fill up!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <Card 
              key={event.id}
              className="group hover:shadow-festival transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 bg-card"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <CardContent className="p-0">
                {/* Event Header with Gradient */}
                <div className={`relative p-6 bg-gradient-to-br ${event.gradient} text-white`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                      {event.type}
                    </span>
                    <span className="text-2xl font-bold">{event.price}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-white/90">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.spots}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="festival" 
                    className="w-full group-hover:shadow-adventure"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* View All Events */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;