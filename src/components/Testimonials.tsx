'use client';
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  acf_fc_layout: string;
  name: string;
  country: string;
  profile_image: { url: string; alt?: string } | false;
  comment: string;
}

interface TestimonialsProps {
  heading: string;
  subheading: string;
  testimonials: Testimonial[];
}

export function Testimonials({ heading, subheading, testimonials }: TestimonialsProps) {
  const prevRef = React.useRef<HTMLButtonElement>(null);
  const nextRef = React.useRef<HTMLButtonElement>(null);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  return (
    <section className="w-full py-20 bg-white" id="testimonials">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          {subheading && (
            <div className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">{subheading}</div>
          )}
          {heading && (
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">{heading}</h2>
          )}
        </div>
        <div className="relative">
          {/* Custom Navigation Buttons */}
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 hover:bg-primary text-gray-700 hover:text-white rounded-full w-12 h-12 flex items-center justify-center shadow transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 hover:bg-primary text-gray-700 hover:text-white rounded-full w-12 h-12 flex items-center justify-center shadow transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 3 },
            }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onInit={(swiper) => {
              if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            pagination={{ clickable: true }}
            className="w-full"
          >
            {testimonials.map((testimonial, idx) => (
              <SwiperSlide key={idx}>
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className="relative -mb-8 z-10">
                    {typeof testimonial.profile_image === 'object' && testimonial.profile_image !== null ? (
                      <Image
                        src={testimonial.profile_image.url}
                        alt={testimonial.profile_image.alt || testimonial.name}
                        width={72}
                        height={72}
                        className="rounded-full border-4 border-white shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 border-4 border-white shadow-lg">
                        {testimonial.name.trim().charAt(0)}
                      </div>
                    )}
                  </div>
                  {/* Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl shadow p-8 pt-12 flex flex-col items-center min-h-[260px]">
                    <p className="text-center text-gray-700 mb-6">{testimonial.comment}</p>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500 italic">{testimonial.country}</div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
} 