import type { ReactNode } from 'react';

/** Centred heading with the underline rule used across the site. */
export default function SectionHeading({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`relative mb-12 text-center text-3xl font-bold text-primary after:absolute after:-bottom-3 after:left-1/2 after:h-1 after:w-16 after:-translate-x-1/2 after:rounded-md after:bg-primary after:content-[''] ${className}`}
    >
      {children}
    </h2>
  );
}
