import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Phone, Facebook, Instagram } from 'lucide-react';

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

async function fetchFooterData() {
  const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  const res = await fetch(`${API_URL}/footer`);
  if (!res.ok) return null;
  const data = await res.json();
  return data[0]?.acf || null;
}

interface FooterMenuItem {
  acf_fc_layout: string;
  page_name: string;
  link: {
    title: string;
    url: string;
    target?: string;
  };
}

interface SocialIcon {
  acf_fc_layout: string;
  social_media_name: string;
  social_media_url: string;
}

export async function Footer() {
  const footer = await fetchFooterData();
  if (!footer) return null;

  return (
    <footer className="w-full bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main 3-column row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: 6/12 */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Logo */}
            {footer.footer_logo?.url && (
              <Image src={footer.footer_logo.url} alt="Footer Logo" width={174} height={71} className="mb-4" />
            )}
            {/* Menu (horizontal) */}
            <nav className="flex flex-wrap gap-6 mb-4">
              {footer.footer_menu?.map((item: FooterMenuItem, idx: number) => {
                const frontendPath = getFrontendPath(item.link.url);
                const isInternal = frontendPath.startsWith('/');
                return isInternal ? (
                  <Link
                    key={idx}
                    href={frontendPath}
                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                  >
                    {item.page_name}
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href={item.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                  >
                    {item.page_name}
                  </a>
                );
              })}
            </nav>
            {/* Description */}
            <p className="text-gray-400 text-sm max-w-lg mb-2">{footer.footer_description}</p>
          </div>

          {/* Column 2: 3/12 */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-white min-w-[20px] mt-1" size={20} />
              <span className="text-gray-300 text-sm whitespace-pre-line">{footer.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-white min-w-[20px]" size={20} />
              <a href={`mailto:${footer.email}`} className="text-gray-300 text-sm hover:underline">{footer.email}</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-white min-w-[20px]" size={20} />
              <span className="text-gray-300 text-sm">{footer.telephone}</span>
            </div>
          </div>

          {/* Column 3: 3/12 (social icons) */}
          <div className="lg:col-span-3 flex flex-col items-start justify-start gap-4">
            {footer.social_media_icons && footer.social_media_icons.length > 0 && (
              <>
                <div className="font-semibold mb-2 text-base">Follow Us</div>
                <div className="flex gap-4 mt-2">
                  {footer.social_media_icons.map((icon: SocialIcon, idx: number) => {
                    const iconMap: Record<string, React.ElementType> = {
                      Facebook,
                      Instagram,
                    };
                    const IconComponent = iconMap[icon.social_media_name] || null;
                    return (
                      <a
                        key={idx}
                        href={icon.social_media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 hover:bg-primary transition-colors rounded-full w-10 h-10 flex items-center justify-center text-white hover:text-white shadow-lg"
                        aria-label={icon.social_media_name}
                      >
                        {IconComponent && <IconComponent size={22} />}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        {/* Branding row */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center">
          <span className="text-gray-500 text-xs">{footer.footer_branding}</span>
        </div>
      </div>
    </footer>
  );
} 