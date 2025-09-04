import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Users, Calendar } from 'lucide-react';
import heroImage from '@/assets/hero-adventure.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Adventure
              <span className="block text-festival animate-festival-glow">
                Starts Here
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
              Join GrandHiking for unforgettable camping, getaway, and festival trips. 
              Where every journey becomes a story worth sharing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="hero" size="lg" className="text-lg">
                See Upcoming Trips
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button variant="outline" size="lg" className="text-lg bg-white/10 border-white/30 text-white hover:bg-white/20">
                Watch Our Story
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
              <div className="flex items-center space-x-3 animate-slide-up">
                <div className="p-3 bg-white/20 rounded-full">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-white/80">Destinations</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 animate-slide-up">
                <div className="p-3 bg-white/20 rounded-full">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">2,500+</div>
                  <div className="text-white/80">Adventurers</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 animate-slide-up">
                <div className="p-3 bg-white/20 rounded-full">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-white/80">Trips Organized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;