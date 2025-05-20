'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WordPressTour } from '@/types/wordpress';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface OurToursProps {
  tours: WordPressTour[];
  subheading?: string;
  heading?: string;
}

export function OurTours({ tours, subheading = 'Our Tours', heading = 'Explore Our Tours' }: OurToursProps) {
  return (
    <section className="w-full py-20 bg-gray-50" id="our-tours">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          {subheading && (
            <div className="text-primary text-sm font-semibold uppercase tracking-wide mb-2">{subheading}</div>
          )}
          {heading && (
            <h2 className="text-3xl md:text-8xl font-bold gradient-heading">{heading}</h2>
          )}
        </div>
        {/* Mobile Swiper - only visible on mobile */}
        <div className="sm:hidden">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1.1}
            loop={true}
            navigation
            className="w-full"
          >
            {tours.map((tour, idx) => (
              <SwiperSlide key={idx}>
                <Link
                  href={`/tours/${idx}`}
                  className="group flex flex-col items-center bg-white rounded-2xl p-[5px] transition-shadow cursor-pointer w-full"
                >
                  <div className="relative w-full h-112 rounded-t-2xl overflow-hidden flex items-center justify-center bg-white">
                    <Image
                      src={tour.tour_image_portrait?.sizes?.large || tour.tour_image_portrait?.url}
                      alt={tour.tour_image_portrait?.alt || tour.tour_heading}
                      fill
                      className="object-cover rounded-t-2xl bg-white"
                      priority={idx === 0}
                    />
                  </div>
                  <div className="flex flex-col items-center px-4 py-6">
                    <h3 className="text-lg font-bold mb-2 text-center">{tour.tour_heading}</h3>
                    <div className="text-gray-700 text-center text-sm" dangerouslySetInnerHTML={{ __html: tour.tour_short_description }} />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Desktop flex grid - only visible on desktop */}
        <div className="hidden sm:block w-full">
          {/* First row: 4 columns */}
          {tours.length > 0 && (
            <div className="grid grid-cols-4 gap-[10px] w-full mb-10" style={{ maxWidth: '1400px', margin: '0 auto' }}>
              {tours.slice(0, 4).map((tour, idx) => (
                <Link
                  key={idx}
                  href={`/tours/${idx}`}
                  className="group flex flex-col items-center bg-white rounded-2xl p-[5px] transition-shadow cursor-pointer"
                >
                  <div className="relative w-full h-96 rounded-t-2xl overflow-hidden flex items-center justify-center bg-white">
                    <Image
                      src={tour.tour_image_portrait?.sizes?.large || tour.tour_image_portrait?.url}
                      alt={tour.tour_image_portrait?.alt || tour.tour_heading}
                      fill
                      className="object-cover rounded-t-2xl bg-white"
                      priority={idx === 0}
                    />
                  </div>
                  <div className="flex flex-col items-center px-4 py-6">
                    <h3 className="text-lg font-bold mb-2 text-center">{tour.tour_heading}</h3>
                    <div className="text-gray-700 text-center text-sm" dangerouslySetInnerHTML={{ __html: tour.tour_short_description }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
          {/* Second row: 3 columns, centered */}
          {tours.length > 4 && (
            <div className="flex justify-center mb-10">
              <div className="grid gap-[10px]" style={{
                gridTemplateColumns: 'repeat(3, minmax(280px, 1fr))',
                maxWidth: '1200px',
                margin: '0 auto',
              }}>
                {tours.slice(4, 7).map((tour, idx) => (
                  <Link
                    key={idx + 4}
                    href={`/tours/${idx + 4}`}
                    className="group flex flex-col items-center bg-white rounded-2xl p-[5px] transition-shadow cursor-pointer"
                  >
                    <div className="relative w-full h-96 rounded-t-2xl overflow-hidden flex items-center justify-center bg-white">
                      <Image
                        src={tour.tour_image_portrait?.sizes?.large || tour.tour_image_portrait?.url}
                        alt={tour.tour_image_portrait?.alt || tour.tour_heading}
                        fill
                        className="object-cover rounded-t-2xl bg-white"
                        priority={idx === 0}
                      />
                    </div>
                    <div className="flex flex-col items-center px-4 py-6">
                      <h3 className="text-lg font-bold mb-2 text-center">{tour.tour_heading}</h3>
                      <div className="text-gray-700 text-center text-sm" dangerouslySetInnerHTML={{ __html: tour.tour_short_description }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* Remaining rows: 4 columns */}
          {tours.length > 7 && (
            <div className="grid grid-cols-4 gap-[10px] w-full" style={{ maxWidth: '1400px', margin: '0 auto' }}>
              {tours.slice(7).map((tour, idx) => (
                <Link
                  key={idx + 7}
                  href={`/tours/${idx + 7}`}
                  className="group flex flex-col items-center bg-white rounded-2xl p-[5px] transition-shadow cursor-pointer"
                >
                  <div className="relative w-full h-96 rounded-t-2xl overflow-hidden flex items-center justify-center bg-white">
                    <Image
                      src={tour.tour_image_portrait?.sizes?.large || tour.tour_image_portrait?.url}
                      alt={tour.tour_image_portrait?.alt || tour.tour_heading}
                      fill
                      className="object-cover rounded-t-2xl bg-white"
                      priority={idx === 0}
                    />
                  </div>
                  <div className="flex flex-col items-center px-4 py-6">
                    <h3 className="text-lg font-bold mb-2 text-center">{tour.tour_heading}</h3>
                    <div className="text-gray-700 text-center text-sm" dangerouslySetInnerHTML={{ __html: tour.tour_short_description }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .gradient-heading {
          background: linear-gradient(to bottom, #000, #f9fafc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </section>
  );
} 