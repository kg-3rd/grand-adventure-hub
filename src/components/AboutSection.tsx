import tghLogo from '@/assets/tgh_logo.png';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-muted/20 border-t border-border/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Text */}
            <div className="text-center md:text-left max-w-2xl mx-auto md:mx-0">
              <h2 className="text-4xl md:text-5xl tracking-[0.2em] font-bold uppercase text-primary/70 mb-8">About Us</h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Welcome to <span className="font-bold">The Grand Hiking & Adventures</span>, your ultimate destination for unforgettable outdoor experiences. Our mission
                is to connect people with nature through meticulously crafted adventures, ranging
                from serene forest hikes to thrilling mountain expeditions.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-6">
                Whether you're an experienced adventurer or a first-time explorer, our team of
                passionate guides ensures every journey is safe, exciting, and filled with
                incredible memories. Join us as we uncover the beauty of the natural world, one step
                at a time.
              </p>
            </div>

            {/* Side Logo */}
            <div className="flex justify-center md:justify-end">
              <img
                src={tghLogo}
                alt="The Grand Hiking & Adventures logo"
                className="h-36 md:h-48 lg:h-64 w-auto max-w-full opacity-90 drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
