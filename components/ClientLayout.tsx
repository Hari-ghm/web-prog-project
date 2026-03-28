'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <AuthProvider>
      {!isLandingPage && <Navbar />}
      <main className="flex-grow">{children}</main>
    </AuthProvider>
  );
}
