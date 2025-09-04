import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Bell } from 'lucide-react';
import { useState } from 'react';

const CTASection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-20 bg-gradient-adventure relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Bell className="w-16 h-16 text-white mx-auto mb-6 animate-adventure-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Don't Miss the Next Trip
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Be the first to know about our upcoming adventures, exclusive deals, 
              and community events. Join our newsletter and never miss out!
            </p>
          </div>
          
          {/* Newsletter Signup */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-12">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-white/90 border-white/20 text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
            <Button 
              type="submit" 
              variant="festival" 
              size="lg"
              className="h-12 px-8 font-semibold"
            >
              Subscribe Now
            </Button>
          </form>
          
          {/* Social Proof */}
          <div className="text-center text-white/80 mb-8">
            <p className="text-sm">Join 2,500+ adventurers already subscribed</p>
          </div>
          
          {/* Additional CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
            >
              Browse All Trips
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;