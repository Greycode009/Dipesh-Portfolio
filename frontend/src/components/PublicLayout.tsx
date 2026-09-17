import type { ReactNode } from 'react';
import ChatWidget from './ChatWidget';
import Footer from './Footer';
import Nav from './Nav';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-content">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      {/*
        Public pages only. The town has its own action button in the same
        corner, and the admin area is not a place for visitor chat.
      */}
      <ChatWidget />
    </div>
  );
}
