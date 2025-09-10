import { useEffect, useMemo, useRef } from 'react';

type LightboxModalProps = {
  isOpen: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  ariaLabel?: string;
};

export default function LightboxModal({ isOpen, src, alt = '', onClose, onPrev, onNext, ariaLabel = 'Lightbox modal' }: LightboxModalProps) {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  // Lock scroll and return focus
  useEffect(() => {
    if (isOpen) {
      lastActiveRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = '';
      lastActiveRef.current?.focus?.();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Keys: ESC closes, arrows navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev?.();
      if (e.key === 'ArrowRight') onNext?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, onPrev, onNext]);

  // Simple focus trap for Tab
  const focusables = useMemo(() => 'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])', []);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || e.key !== 'Tab') return;
      const root = backdropRef.current;
      if (!root) return;
      const f = Array.from(root.querySelectorAll<HTMLElement>(focusables)).filter(el => !el.hasAttribute('disabled'));
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, focusables]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      {onPrev && (
        <button type="button" aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2" onClick={onPrev}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M15.53 4.47a.75.75 0 010 1.06L9.06 12l6.47 6.47a.75.75 0 11-1.06 1.06l-7-7a.75.75 0 010-1.06l7-7a.75.75 0 011.06 0z" clipRule="evenodd" /></svg>
        </button>
      )}
      {onNext && (
        <button type="button" aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2" onClick={onNext}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M8.47 4.47a.75.75 0 000 1.06L14.94 12l-6.47 6.47a.75.75 0 101.06 1.06l7-7a.75.75 0 000-1.06l-7-7a.75.75 0 00-1.06 0z" clipRule="evenodd" /></svg>
        </button>
      )}
      <div className="relative max-w-[100vw] max-h-[90vh]">
        <img src={src} alt={alt} className="max-w-[100vw] max-h-[90vh] object-contain" />
        <button ref={closeBtnRef} type="button" aria-label="Close" onClick={onClose} className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
}
