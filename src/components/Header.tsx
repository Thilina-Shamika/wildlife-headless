"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchHeaderMenu } from '@/lib/api';
import { Menu, X } from 'lucide-react';

interface HeaderMenuItem {
  page_link: { url: string; target?: string };
  page_name: string;
}
interface HeaderMenu {
  logo?: { url: string; alt?: string };
  menu?: HeaderMenuItem[];
}

function getFrontendPath(wpUrl: string) {
  if (!wpUrl) return '/';
  try {
    const url = new URL(wpUrl);
    const path = url.pathname.replace(/\/+$/, '');
    if (path === '/home') return '/';
    return path || '/';
  } catch {
    if (wpUrl.startsWith('/')) {
      if (wpUrl === '/home/' || wpUrl === '/home') return '/';
      return wpUrl.replace(/\/+$/, '');
    }
    return wpUrl;
  }
}

export function Header() {
  const [header, setHeader] = useState<HeaderMenu | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchHeaderMenu().then(setHeader);
  }, []);

  return (
    <>
      {/* Off-canvas Mobile Menu Overlay (outside header for full viewport coverage) */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!isOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 z-50 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />
        {/* Off-canvas menu */}
        <div
          className={`absolute top-0 left-0 h-full w-64 bg-black shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-7 h-7" />
          </button>
          <ul className="flex flex-col gap-6 text-lg font-medium text-white p-8 pt-16">
            {header?.menu?.map((item, idx) => {
              const frontendPath = getFrontendPath(item.page_link.url);
              const isInternal = frontendPath.startsWith('/');
              return (
                <li key={idx}>
                  {isInternal ? (
                    <Link
                      href={frontendPath}
                      className="hover:text-primary transition-colors text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.page_name}
                    </Link>
                  ) : (
                    <a
                      href={item.page_link.url}
                      target={item.page_link.target || '_self'}
                      rel={item.page_link.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="hover:text-primary transition-colors text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.page_name}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <header className="fixed top-0 left-0 w-full z-30 backdrop-blur-md shadow-none border-b border-white/10 transition-all duration-300 sticky">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <Link href="/">
              {header?.logo?.url ? (
                <Image
                  src={header.logo.url}
                  alt={header.logo.alt || 'Logo'}
                  width={120}
                  height={48}
                  priority
                  className="object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-black drop-shadow-sm">Ceylonicus</span>
              )}
            </Link>
          </div>
          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 text-base font-medium text-white">
            {header?.menu?.map((item, idx) => {
              const frontendPath = getFrontendPath(item.page_link.url);
              const isInternal = frontendPath.startsWith('/');
              return (
                <li key={idx}>
                  {isInternal ? (
                    <Link
                      href={frontendPath}
                      className="hover:text-primary transition-colors text-white"
                    >
                      {item.page_name}
                    </Link>
                  ) : (
                    <a
                      href={item.page_link.url}
                      target={item.page_link.target || '_self'}
                      rel={item.page_link.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="hover:text-primary transition-colors text-white"
                    >
                      {item.page_name}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </nav>
      </header>
    </>
  );
} 