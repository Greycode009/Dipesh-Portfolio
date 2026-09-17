import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-content">
      <Sidebar />
      <main className="min-h-screen md:pl-64">{children}</main>
    </div>
  );
}
