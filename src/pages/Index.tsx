import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import TripsSection from '@/components/TripsSection';
import EventsSection from '@/components/EventsSection';
import CommunitySection from '@/components/CommunitySection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <TripsSection />
        <EventsSection />
        <CommunitySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;