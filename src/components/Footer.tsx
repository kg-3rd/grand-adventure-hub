import { Instagram, Facebook } from 'lucide-react';
import tghLogo from '@/assets/tgh_logo.png';

// Local TikTok icon (lucide-react does not provide a TikTok brand icon)
const TikTokIcon = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15.5 3c.38 1.72 1.52 3.2 3.1 4.02 1.02.53 2.17.78 3.32.75v3.04c-1.83-.1-3.61-.66-5.1-1.62v5.9c0 3.67-2.97 6.64-6.64 6.64S3.54 18.76 3.54 15.1c0-3.67 2.97-6.64 6.64-6.64.41 0 .81.04 1.2.11v3.28c-.38-.12-.79-.19-1.2-.19-2.01 0-3.64 1.63-3.64 3.64s1.63 3.64 3.64 3.64 3.64-1.63 3.64-3.64V3h3.18Z"
      fill="currentColor"
    />
  </svg>
);

const Footer = () => {
  return (
  <footer id="contact" className="bg-background border-t border-border/20 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#home" aria-label="GrandHiking Home" className="inline-flex items-center gap-3 mb-6">
              <img src={tghLogo} alt="GrandHiking logo" className="h-16 w-auto object-contain" />
              {/* <h3 className="text-2xl md:text-3xl font-bold text-primary">
                Grand<span className="text-festival">Hiking</span>
              </h3> */}
            </a>
            <p className="text-muted-foreground mb-8 max-w-md text-lg font-light leading-relaxed">
              Creating unforgettable adventures through immersive experiences. 
              Join our community of explorers.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/the_grand_hiking/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110"
              >
                <Instagram size={28} />
              </a>
              <a
                href="https://web.facebook.com/TheGrandHikingAndAdventures"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110"
              >
                <Facebook size={28} />
              </a>
              <a
                href="https://www.tiktok.com/@the_grand_hiking?_r=1&_t=ZS-92moQeKuaEJ"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="TikTok"
                className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110"
              >
                <TikTokIcon size={28} />
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

              <li>
                <a href="tel:+27792960795" className="hover:text-primary transition-colors">+27 79 296 0795</a>
              </li>
              <li>
                <a href="tel:+27726955414" className="hover:text-primary transition-colors">+27 72 695 5414</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/20 pt-8 text-center text-muted-foreground">
          <p className="font-light">&copy; 2024 The Grand Hiking and Adventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
