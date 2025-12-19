import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const Rentals = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Rentals – Coming Soon';

    const metaName = 'robots';
    const existing = document.querySelector(`meta[name="${metaName}"]`) as HTMLMetaElement | null;
    const created = !existing;
    const meta = existing ?? document.createElement('meta');
    if (!existing) {
      meta.setAttribute('name', metaName);
      document.head.appendChild(meta);
    }
    const previousContent = meta.getAttribute('content');
    meta.setAttribute('content', 'noindex');

    return () => {
      document.title = previousTitle;
      if (created) {
        meta.remove();
        return;
      }
      if (previousContent === null) {
        meta.removeAttribute('content');
      } else {
        meta.setAttribute('content', previousContent);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-24">
        <section className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <Badge className="mx-auto mb-5 border-primary/30 bg-primary/10 text-primary uppercase tracking-[0.3em]">
                Under Development
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                Rentals – Coming Soon
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We are building a rental hub for adventure-ready gear and trip add-ons.
                Book with us.
              </p>
            </div>
            <div className="mt-10 rounded-2xl border border-border/30 bg-muted/20 p-8 text-center shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Adventure Essentials</h2>
              <p className="text-muted-foreground leading-relaxed">
                 Trailers, tents, sleeping systems, and campsite staples prepared for the season ahead.
              </p>
            </div>

            {/* TODO: Add rental listings grid once inventory is live. */}
            {/* TODO: Add booking flow and availability calendar. */}
            {/* TODO: Add pricing and package comparisons. */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Rentals;
