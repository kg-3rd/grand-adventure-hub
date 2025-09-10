import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Tent, Mountain, Music } from 'lucide-react';
import campingImage from '@/assets/camping-trip.jpg';
import getawayImage from '@/assets/getaway-trip.jpg';
import festivalImage from '@/assets/festival-trip.jpg';
import lesotho from '@/assets/Lesotho-Afriski.jfif';

const TripsSection = () => {
  const trips = [
    {
      title: 'Camping Trips',
      description: 'Experience the great outdoors with guided camping adventures. From cozy campfires to stargazing nights.',
      image: lesotho,
      icon: Tent,
      gradient: 'from-primary to-earth',
    },
    {
      title: 'Getaway Trips', 
      description: 'Escape to breathtaking destinations. Luxury cabins, scenic lakes, and unforgettable mountain views.',
      image: getawayImage,
      icon: Mountain,
      gradient: 'from-accent to-primary',
    },
    {
      title: 'Festival Trips',
      description: 'Dance under the stars at the best music festivals. Premium camping and VIP experiences included.',
      image: festivalImage,
      icon: Music,
      gradient: 'from-festival to-accent',
    },
  ];

  return (
    <section id="trips" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your 
            <span className="text-primary"> Adventure</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're seeking wilderness thrills, peaceful retreats, or festival vibes, 
            we've got the perfect adventure waiting for you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trips.map((trip, index) => (
            <Card 
              key={trip.title} 
              className="group hover:shadow-adventure transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 bg-card/80 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={trip.image} 
                    alt={trip.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${trip.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-300`}></div>
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full">
                    <trip.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {trip.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {trip.description}
                  </p>
                  
                  <Button 
                    variant="adventure" 
                    className="w-full group-hover:shadow-nature"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TripsSection;