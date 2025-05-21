"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface TourImage {
  url: string;
  alt: string;
  sizes?: {
    large: string;
  };
}

export function TourGallery({ gallery, tourHeading }: { gallery: TourImage[]; tourHeading: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!gallery || gallery.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {gallery.map((image, idx) => (
          <div
            key={idx}
            className="relative aspect-square cursor-pointer"
            onClick={() => {
              setIndex(idx);
              setOpen(true);
            }}
          >
            <Image
              src={image.sizes?.large || image.url}
              alt={image.alt || `${tourHeading} - Image ${idx + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={gallery.map(img => ({ src: img.sizes?.large || img.url, alt: img.alt }))}
      />
    </>
  );
} 