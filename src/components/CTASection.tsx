import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Bell } from 'lucide-react';
import { useState } from 'react';

const CTASection = () => {
  return (
    <section className="py-32 bg-gradient-adventure text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_0%,transparent_50%)]"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in leading-tight">
            Don't Miss the Next
            <span className="block text-primary"> Adventure</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-white/80 animate-slide-up font-light leading-relaxed max-w-3xl mx-auto">
            Subscribe for updates and be the first to know about our latest journeys
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto mb-12">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-8 py-5 rounded-2xl text-foreground bg-white/95 backdrop-blur-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg shadow-cinematic"
            />
            <Button variant="hero" size="lg" className="px-10 py-5 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl tracking-wide uppercase">
              Subscribe
            </Button>
          </div>
          
          <p className="text-white/60 text-base font-light">
            Join 2,500+ adventurers already on our journey
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;