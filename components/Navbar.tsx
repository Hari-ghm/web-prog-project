'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-black/5 dark:bg-white/5 text-secondary hover:text-foreground transition-all duration-300 hover:scale-105"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <Link
              href="/login"
              className="ml-4 px-5 py-2 rounded-full bg-foreground text-background font-semibold transition-all duration-300 hover:scale-105 shadow-md dark:shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)] dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
            >
              Sign In
            </Link>
          </div>
          <div className="-mr-2 flex md:hidden items-center space-x-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-secondary hover:text-foreground"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
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
            <Link
              href="/login"
              className="block w-full text-center mt-4 px-4 py-3 rounded-md bg-foreground text-background dark:bg-blue-600 dark:text-white font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
