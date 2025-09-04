import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import community1 from '@/assets/community-1.jpg';
import community2 from '@/assets/community-2.jpg';

const CommunitySection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'San Francisco, CA',
      text: 'GrandHiking gave me the most incredible festival experience! The community is amazing and I made lifelong friends.',
      rating: 5,
      trip: 'Desert Music Festival'
    },
    {
      name: 'Mike Chen',
      location: 'Austin, TX', 
      text: 'The camping trip to Rocky Mountains was life-changing. Professional guides, amazing people, and unforgettable memories.',
      rating: 5,
      trip: 'Rocky Mountain Expedition'
    },
    {
      name: 'Emma Davis',
      location: 'Portland, OR',
      text: 'Perfect blend of adventure and relaxation. The Lake Tahoe retreat exceeded all my expectations!',
      rating: 5,
      trip: 'Lake Tahoe Retreat'
    }
  ];

  return (
    <section id="community" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Join Our 
            <span className="text-primary"> Community</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover what makes our adventures special through the eyes of our fellow explorers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl group">
              <img 
                src={community1}
                alt="Community around campfire"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-bold text-lg">Campfire Stories</h4>
                <p className="text-white/90">Sharing memories under the stars</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl group">
              <img 
                src={community2}
                alt="Hiking group"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-bold text-lg">Team Adventures</h4>
                <p className="text-white/90">Supporting each other on the journey</p>
              </div>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name} 
                className="hover:shadow-nature transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm"
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-foreground mb-4 leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-festival fill-current" />
                        ))}
                      </div>
                      
                      <div className="text-sm">
                        <div className="font-semibold text-foreground">
                          {testimonial.name}
                        </div>
                        <div className="text-muted-foreground">
                          {testimonial.location} • {testimonial.trip}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2,500+</div>
            <div className="text-muted-foreground">Happy Adventurers</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-3xl md:text-4xl font-bold text-festival mb-2">98%</div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">50+</div>
            <div className="text-muted-foreground">Destinations</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-3xl md:text-4xl font-bold text-earth mb-2">5+</div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;