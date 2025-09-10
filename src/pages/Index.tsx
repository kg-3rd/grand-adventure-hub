import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import EventsSection from '@/components/EventsSection';
import GallerySection from '@/components/GallerySection';
import ReviewsSection from '@/components/ReviewsSection';
import AboutSection from '../components/AboutSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
  <HeroSection />
  <AboutSection />
  <EventsSection />
  <GallerySection />
  <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;