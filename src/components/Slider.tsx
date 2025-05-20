'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WordPressSliderSlide } from '@/types/wordpress';

interface SliderProps {
  slides: WordPressSliderSlide[];
}

const THUMBNAIL_COUNT = 5;
const MOBILE_THUMBNAIL_COUNT = 3;
const AUTOPLAY_INTERVAL = 5000;

export function Slider({ slides }: SliderProps) {
  const [centerIndex, setCenterIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive thumbnail count
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const thumbnailCount = isMobile ? MOBILE_THUMBNAIL_COUNT : THUMBNAIL_COUNT;
  const middleIndex = Math.floor(thumbnailCount / 2);

  // Calculate the window of visible thumbnails so that centerIndex is always the middle (when possible)
  let start = Math.max(0, centerIndex - middleIndex);
  const end = Math.min(slides.length, start + thumbnailCount);
  if (end - start < thumbnailCount) start = Math.max(0, end - thumbnailCount);
  const visibleThumbnails = slides.slice(start, end);
  const middleIdx = centerIndex - start;

  // Animate to new slide with fading
  const goToSlide = useCallback((newIndex: number) => {
    if (newIndex !== centerIndex) {
      setPrevIndex(centerIndex);
      setIsFading(true);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = setTimeout(() => {
        setCenterIndex(newIndex);
        setIsFading(false);
      }, 700);
    }
  }, [centerIndex]);

  // When clicking a thumbnail, center it if possible and make it the main slide
  const handleThumbnailClick = (realIdx: number) => {
    goToSlide(realIdx);
  };

  // Autoplay: advance the centerIndex every AUTOPLAY_INTERVAL ms
  useEffect(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      goToSlide(centerIndex >= slides.length - 1 ? 0 : centerIndex + 1);
    }, AUTOPLAY_INTERVAL);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [centerIndex, slides.length, goToSlide]);

  const mainSlide = slides[centerIndex];
  const prevSlide = slides[prevIndex];

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden" style={{ marginTop: '-110px' }}>
      {/* Main Slide with crossfade and Ken Burns effect on both images */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Previous image for fade transition, Ken Burns effect */}
        {(isFading || prevIndex !== centerIndex) && (
          <Image
            src={prevSlide.image?.sizes?.large || prevSlide.image?.url}
            alt={prevSlide.image?.alt || prevSlide.title}
            fill
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 opacity-100 fade-out ken-burns"
            style={{ borderRadius: 0 }}
            priority
          />
        )}
        {/* Current image for fade transition, Ken Burns effect */}
        <Image
          src={mainSlide.image?.sizes?.large || mainSlide.image?.url}
          alt={mainSlide.image?.alt || mainSlide.title}
          fill
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${isFading ? 'opacity-0 fade-in' : 'opacity-100'} ken-burns`}
          style={{ borderRadius: 0 }}
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 z-0 transition-all duration-700" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <h2 className={`text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg transition-all duration-700 text-center ${isFading ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'} animate-title-reveal`}
            key={mainSlide.title + centerIndex}
          >
            {mainSlide.title}
          </h2>
          <div
            className={`text-sm md:text-2sm mb-8 text-white drop-shadow-lg transition-all duration-700 max-w-2xl text-center ${isFading ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'} animate-desc-reveal`}
            key={mainSlide.description + centerIndex}
            dangerouslySetInnerHTML={{ __html: mainSlide.description }}
          />
          <Link
            href={mainSlide.link?.url || '#'}
            className={`inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-700 shadow-lg ${isFading ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'}`}
            key={mainSlide.button_text + centerIndex}
          >
            {mainSlide.button_text}
          </Link>

          {/* Thumbnails */}
          <div className="flex justify-center gap-8 mt-16 w-full items-center">
            {visibleThumbnails.map((slide, idx) => {
              const realIdx = start + idx;
              const isMiddle = idx === middleIdx;
              const isActive = realIdx === centerIndex;
              return (
                <button
                  key={realIdx}
                  onClick={() => handleThumbnailClick(realIdx)}
                  className={`group relative transition-all duration-500 flex items-center justify-center focus:outline-none ${isActive ? 'z-20' : 'z-10'} ${isMiddle ? 'scale-110' : 'scale-100 opacity-80'}`}
                  style={{ borderRadius: '1rem' }}
                  aria-label={`Go to slide ${realIdx + 1}`}
                >
                  <div className={`relative ${isMiddle ? 'w-28 h-28 md:w-44 md:h-44' : 'w-24 h-24 md:w-32 md:h-32'}`}>
                    <Image
                      src={slide.image?.sizes?.thumbnail || slide.image?.url}
                      alt={slide.image?.alt || slide.title}
                      fill
                      className="object-cover rounded-xl transition-all duration-500"
                    />
                  </div>
                  {/* Overlay title, always visible, up to 2 lines, wrap if needed */}
                  <span className="absolute bottom-2 left-0 right-0 text-[11px] md:text-xs font-semibold w-full text-center pointer-events-none select-none text-white leading-tight break-words whitespace-normal" style={{maxHeight:'2.6em',overflow:'hidden',display:'block'}}>
                    {slide.title}
                  </span>
                  {/* Animated overlay for active thumbnail */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl border-2 border-primary animate-pulse pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Custom CSS for fade, reveal, and Ken Burns animations */}
      <style jsx>{`
        .fade-in { animation: fadeIn 0.7s forwards; }
        .fade-out { animation: fadeOut 0.7s forwards; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-title-reveal, .animate-desc-reveal {
          animation: revealDown 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes revealDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ken-burns {
          animation: kenBurnsZoom 5s ease-in-out forwards;
        }
        @keyframes kenBurnsZoom {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.12) translate(-2%, -2%);
          }
        }
      `}</style>
    </section>
  );
}

// Tailwind custom animation (add to your globals.css or tailwind config if not present):
// .animate-fade-in { @apply opacity-0 translate-y-4; animation: fadeIn 0.7s forwards; }
// @keyframes fadeIn { to { opacity: 1; transform: none; } } 