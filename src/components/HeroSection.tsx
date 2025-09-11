import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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
                <p className="text-sm md:text-base tracking-[0.2em] uppercase text-primary/80 mb-6">
                  Explore. Adventure. Connect.
                </p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-[0.9] tracking-tight">
              The Grand Hiking and Adventures
              {/* <span className="block text-primary animate-festival-glow">
                Starts Here
              </span> */}
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
              Unforgettable camping, getaway, and festival trips with The Grand Hiking and Adventures
            </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild variant="hero" size="lg">
                    <a href="#events" className="inline-flex items-center">
                      View Upcoming Trips
                      <ArrowRight className="ml-2" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <a href="#gallery">Explore Gallery</a>
                  </Button>
                </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default HeroSection;