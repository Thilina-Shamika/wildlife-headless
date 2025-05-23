'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false });
import 'yet-another-react-lightbox/styles.css';

export default function GalleryMasonry({ images }: { images: any[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="container mx-auto px-4 py-12 text-center text-gray-500">No images found.</div>;
  }

  // Prepare slides for Lightbox
  const slides = images.map((img) => ({ src: img.url, alt: img.alt || '' }));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="mb-4 break-inside-avoid cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            onClick={() => { setOpen(true); setIndex(idx); }}
          >
            <Image
              src={img.url}
              alt={img.alt || `Gallery Image ${idx + 1}`}
              width={img.width || 600}
              height={img.height || 400}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          index={index}
          on={{ view: ({ index: i }) => setIndex(i) }}
        />
      )}
    </div>
  );
} 