import type { ReactNode } from 'react';
import Footer from './Footer';
import Nav from './Nav';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-content">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
