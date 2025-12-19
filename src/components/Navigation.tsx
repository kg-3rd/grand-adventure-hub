import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import tghLogo from '@/assets/tgh_logo.png';

type NavItem = { name: string; path: string } | { name: string; hash: string };

const NAV_OFFSET_FALLBACK = 120;
const MAX_SCROLL_ATTEMPTS = 20;

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', hash: 'home' },
  { name: 'About', hash: 'about' },
  { name: 'Events', hash: 'events' },
  { name: 'Rentals', path: '/rentals' },
  { name: 'Gallery', hash: 'gallery' },
  { name: 'Reviews', hash: 'reviews' },
  { name: 'Contact', hash: 'contact' },
];

const SECTION_IDS = NAV_ITEMS
  .filter((item): item is { name: string; hash: string } => 'hash' in item)
  .map((item) => item.hash);

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const wasContactVisible = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const sectionTarget = (hash: string) =>
    `/#${hash}`;

  const [activeSection, setActiveSection] = useState<string>('home');

  const getNavOffset = useCallback(
    () => navRef.current?.offsetHeight ?? NAV_OFFSET_FALLBACK,
    []
  );

  const isContactInView = useCallback(() => {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return false;
    const rect = contactSection.getBoundingClientRect();
    const navOffset = getNavOffset();
    return rect.top < window.innerHeight && rect.bottom > navOffset;
  }, [getNavOffset]);

  const scrollToElement = useCallback(
    (target: HTMLElement) => {
      const top = target.getBoundingClientRect().top + window.scrollY - getNavOffset();
      window.scrollTo({ top, behavior: 'smooth' });
    },
    [getNavOffset]
  );

  const scrollToIdWithRetry = useCallback((id: string) => {
    let attempts = 0;
    let rafId = 0;

    const attemptScroll = () => {
      const target = document.getElementById(id);
      if (target) {
        scrollToElement(target);
        return;
      }
      if (attempts >= MAX_SCROLL_ATTEMPTS) return;
      attempts += 1;
      rafId = window.requestAnimationFrame(attemptScroll);
    };

    attemptScroll();

    return () => window.cancelAnimationFrame(rafId);
  }, [scrollToElement]);

  useEffect(() => {
    if (!isLandingPage) return;

    const rawHash = location.hash;
    const decodedHash = rawHash ? decodeURIComponent(rawHash.slice(1)) : '';
    const targetId = decodedHash || 'home';

    if (!rawHash && targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    return scrollToIdWithRetry(targetId);
  }, [isLandingPage, location.hash, scrollToIdWithRetry]);

  useEffect(() => {
    if (!isLandingPage) return;

    let rafId = 0;

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const contactVisible = isContactInView();

        if (contactVisible) {
          wasContactVisible.current = true;
          setActiveSection('contact');
          return;
        }

        if (wasContactVisible.current) {
          wasContactVisible.current = false;
          const navOffset = getNavOffset();
          const sections = SECTION_IDS
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => Boolean(el));

          if (!sections.length) return;

          const closest = sections
            .map((section) => ({
              id: section.id,
              distance: Math.abs(section.getBoundingClientRect().top - navOffset),
            }))
            .sort((a, b) => a.distance - b.distance)[0];

          if (closest) {
            setActiveSection(closest.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, [getNavOffset, isContactInView, isLandingPage]);

  useEffect(() => {
    if (!isLandingPage) {
      // Keep a stable active state on non-landing pages so the selected item stays highlighted.
      setActiveSection(location.pathname);
      return;
    }

    const hash = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';
    setActiveSection(hash || 'home');

    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    let observer: IntersectionObserver | null = null;

    const createObserver = () => {
      const navOffset = getNavOffset();
      const bottomMargin = Math.max(0, window.innerHeight - navOffset - 1);
      const rootMargin = `-${navOffset}px 0px -${bottomMargin}px 0px`;

      observer = new IntersectionObserver(
        (entries) => {
          if (isContactInView()) {
            setActiveSection('contact');
            return;
          }
          const visible = entries.filter((entry) => entry.isIntersecting);
          if (!visible.length) return;
          const topEntry = visible.sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - navOffset) -
              Math.abs(b.boundingClientRect.top - navOffset)
          )[0];
          setActiveSection(topEntry.target.id);
        },
        {
          root: null,
          rootMargin,
          threshold: 0,
        }
      );

      sections.forEach((section) => observer?.observe(section));
    };

    createObserver();

    const handleResize = () => {
      observer?.disconnect();
      createObserver();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer?.disconnect();
    };
  }, [getNavOffset, isLandingPage, location.hash, location.pathname]);

  const scrollToSection = (hash: string) => {
    if (!isLandingPage) return;
    // React Router won't re-run hash effects if the hash is already set, so scroll manually.
    scrollToIdWithRetry(hash);
  };

  const isActive = (item: NavItem) => {
    if ('path' in item) return location.pathname === item.path;
    if (item.hash === 'gallery' && location.pathname === '/gallery') return true;
    return isLandingPage && activeSection === item.hash;
  };

  const renderNavItem = (
    item: NavItem,
    className: string,
    onClick?: () => void
  ) => {
    const to = 'path' in item ? item.path : sectionTarget(item.hash);
    const activeClass = isActive(item)
      ? 'text-primary after:w-full'
      : '';
    const handleClick = () => {
      if ('hash' in item) {
        scrollToSection(item.hash);
      }
      onClick?.();
    };
    return (
      <Link
        key={item.name}
        to={to}
        className={`${className} ${activeClass}`}
        onClick={handleClick}
      >
        {item.name}
      </Link>
    );
  };

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-xl shadow-cinematic border-b border-border/20' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-24 md:h-28 lg:h-32">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to={sectionTarget('home')}
              aria-label="GrandHiking Home"
              className="inline-flex items-center gap-3"
              onClick={() => scrollToSection('home')}
            >
              <img
                src={tghLogo}
                alt="GrandHiking logo"
                className="h-20 md:h-24 lg:h-28 w-auto object-contain drop-shadow-md"
              />
              {/* <h1
                className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-primary' : 'text-white'
                }`}
              >
                The Grand <span className="text-festival">Hiking</span>
              </h1> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {NAV_ITEMS.map((item) =>
              renderNavItem(
                item,
                `text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:text-primary relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${
                  isScrolled ? 'text-foreground' : 'text-white/90'
                }`
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`transition-colors duration-300 ${
                isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-primary'
              }`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-3 bg-background/98 backdrop-blur-xl rounded-xl mt-4 shadow-cinematic border border-border/20">
              {NAV_ITEMS.map((item) =>
                renderNavItem(
                  item,
                  "block px-4 py-3 text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium tracking-wide uppercase",
                  () => setIsMobileMenuOpen(false)
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
