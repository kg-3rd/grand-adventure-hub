import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Users, Calendar } from 'lucide-react';
import heroImage from '@/assets/hero-adventure.jpg';

const HeroSection = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 animate-parallax"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-overlay"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-blur-in">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-[0.9] tracking-tight">
              Adventure
              <span className="block text-primary animate-festival-glow">
                Starts Here
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
              Unforgettable camping, getaway, and festival trips with GrandHiking
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button variant="hero" size="lg" className="text-lg px-10 py-4 text-base font-medium tracking-wide uppercase">
                See Upcoming Events
                <ArrowRight className="ml-3" size={22} />
              </Button>
            </div>
            
            {/* Floating Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-white max-w-4xl mx-auto">
              <div className="text-center animate-float" style={{ animationDelay: '0s' }}>
                <div className="inline-flex p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
                  <MapPin size={32} className="text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-white/70 text-lg font-light tracking-wide uppercase">Destinations</div>
              </div>
              
              <div className="text-center animate-float" style={{ animationDelay: '2s' }}>
                <div className="inline-flex p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
                  <Users size={32} className="text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">2,500+</div>
                <div className="text-white/70 text-lg font-light tracking-wide uppercase">Adventurers</div>
              </div>
              
              <div className="text-center animate-float" style={{ animationDelay: '4s' }}>
                <div className="inline-flex p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
                  <Calendar size={32} className="text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-white/70 text-lg font-light tracking-wide uppercase">Trips Organized</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1.5 h-4 bg-white/60 rounded-full mt-3 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;