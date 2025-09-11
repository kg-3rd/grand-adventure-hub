import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrev?.();
          break;
        case 'ArrowRight':
          onNext?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:bg-white/20 z-10"
      >
        <X size={28} />
      </Button>

      {/* Previous Button */}
      {onPrev && images.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
        >
          <ChevronLeft size={32} />
        </Button>
      )}

      {/* Next Button */}
      {onNext && images.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
        >
          <ChevronRight size={32} />
        </Button>
      )}

      {/* Image */}
      <div className="relative max-w-[92vw] sm:max-w-[90vw] max-h-[calc(100vh-120px)] flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-cinematic animate-blur-in"
        />
      </div>

      {/* Image Counter (below image, not overlapping) */}
      {images.length > 1 && (
        <div className="mt-4 text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};