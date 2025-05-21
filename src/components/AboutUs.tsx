'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WordPressAboutUs } from '@/types/wordpress';

interface AboutUsProps {
  about: WordPressAboutUs;
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

export function AboutUs({ about }: AboutUsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log('AboutUs Component Props:', JSON.stringify(about, null, 2));
  }, [about]);

  return (
    <section className="w-full py-20 bg-white" id="about-us">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        {/* Left column: headings and button */}
        <div className="space-y-6">
          <div className="text-primary text-sm font-semibold uppercase tracking-wide">{about.sub_heading}</div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">{about.main_heading}</h2>
          <div className="text-gray-700 text-sm md:text-sm" dangerouslySetInnerHTML={{ __html: about.short_description }} />
          {/* Button Link */}
          {(() => {
            const frontendPath = getFrontendPath(about.button_link?.url || '#');
            const isInternal = frontendPath.startsWith('/');
            if (isInternal) {
              return (
                <Link
                  href={frontendPath}
                  className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg"
                >
                  {about.button_text}
                </Link>
              );
            } else {
              return (
                <a
                  href={about.button_link?.url || '#'}
                  target={about.button_link?.target || '_self'}
                  rel={about.button_link?.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg"
                >
                  {about.button_text}
                </a>
              );
            }
          })()}
        </div>
        {/* Center column: image */}
        <div className="flex justify-center h-full w-full items-center">
          <div className="relative w-full aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden">
            {about.center_image?.sizes?.large || about.center_image?.url ? (
              <Image
                src={about.center_image.sizes.large || about.center_image.url}
                alt={about.center_image.alt || about.center_image.title || 'About Us Image'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
        </div>
        {/* Right column: why/faq */}
        <div>
          <h3 className="text-xl font-bold mb-4">Why choose us?</h3>
          <div className="mb-6 text-sm md:text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: about.why_description }} />
          <div className="space-y-4">
            {about.why_us_faq?.map((faq, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-panel-${idx}`}
                >
                  <span className="font-semibold text-left">{faq.faq_title}</span>
                  <svg
                    className={`w-5 h-5 ml-2 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  id={`faq-panel-${idx}`}
                  className={`px-4 py-3 text-gray-700 bg-white transition-all duration-300 ${openIndex === idx ? 'block' : 'hidden'}`}
                  dangerouslySetInnerHTML={{ __html: faq.faq_description }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 