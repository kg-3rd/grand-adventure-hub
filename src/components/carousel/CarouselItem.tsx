import { PropsWithChildren } from 'react';

type CarouselItemProps = PropsWithChildren<{ className?: string }>;

export default function CarouselItem({ children, className = '' }: CarouselItemProps) {
  return (
    <div
  className={`snap-start shrink-0 overflow-visible w-full sm:w-[calc((100%-2rem)/2)] md:w-[calc((100%-4rem)/3)] lg:w-[calc((100%-4rem)/3)] xl:w-[calc((100%-4rem)/3)] ${className}`}
    >
      {children}
    </div>
  );
}
