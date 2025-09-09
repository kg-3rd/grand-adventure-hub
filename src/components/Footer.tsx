import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/20 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold text-primary mb-6">
              Grand<span className="text-festival">Hiking</span>
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md text-lg font-light leading-relaxed">
              Creating unforgettable adventures through immersive experiences. 
              Join our community of explorers.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110">
                <Instagram size={28} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110">
                <Facebook size={28} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110">
                <Mail size={28} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-6 text-lg tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Home</a></li>
              <li><a href="#events" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Events</a></li>
              <li><a href="#gallery" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Gallery</a></li>
              <li><a href="#reviews" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Reviews</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-light">About</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Contact</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-6 text-lg tracking-wide uppercase">Contact</h4>
            <ul className="space-y-3 text-muted-foreground font-light">
              <li>hello@grandhiking.com</li>
              <li>(555) 123-4567</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/20 pt-8 text-center text-muted-foreground">
          <p className="font-light">&copy; 2024 GrandHiking Adventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;