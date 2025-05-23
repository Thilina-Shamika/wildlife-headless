"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';
import Link from 'next/link';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface Tour {
  tour_heading: string;
  tour_image_portrait: { url: string; alt: string; width: number; height: number };
  tour_short_description: string;
}

export default function OurToursSlider({ tours }: { tours: Tour[] }) {
  return (
    <div className="w-full">
      <Swiper
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {tours.map((tour, idx) => (
          <SwiperSlide key={`${tour.tour_heading}-${idx}`}>
            <Link href={`/our-tours/${slugify(tour.tour_heading)}`}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer h-full flex flex-col">
                <div className="relative w-full h-96">
                  <Image
                    src={tour.tour_image_portrait.url}
                    alt={tour.tour_image_portrait.alt || tour.tour_heading}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end items-start p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">{tour.tour_heading}</h3>
                    <p className="text-white text-base flex-1">{tour.tour_short_description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 