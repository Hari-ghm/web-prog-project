'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Energy Sources', href: '/sources' },
    { name: 'Reports', href: '/reports' },
    { name: 'Alerts', href: '/alerts' },
    { name: 'Settings', href: '/settings' },
    { name: 'Admin', href: '/admin/sources' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
              EnerGrid
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    pathname === link.href
                      ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-600/20 dark:border-blue-600/50'
                      : 'text-secondary hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {!loading && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <User size={14} className="text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">{user.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 uppercase">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full bg-black/5 dark:bg-white/5 text-secondary hover:text-red-400 transition-all duration-300 hover:scale-105"
                  aria-label="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : !loading ? (
              <Link
                href="/login"
                className="ml-4 px-5 py-2 rounded-full bg-foreground text-background font-semibold transition-all duration-300 hover:scale-105 shadow-md dark:shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)] dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
              >
                Sign In
              </Link>
            ) : null}
          </div>
          <div className="-mr-2 flex md:hidden items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary hover:text-foreground focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? <Menu size={24} /> : <X size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-border/50 animate-in slide-in-from-top-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400'
                    : 'text-secondary hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!loading && user ? (
              <button
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10"
              >
                Sign Out ({user.name})
              </button>
            ) : !loading ? (
              <Link
                href="/login"
                className="block w-full text-center mt-4 px-4 py-3 rounded-md bg-foreground text-background dark:bg-blue-600 dark:text-white font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
