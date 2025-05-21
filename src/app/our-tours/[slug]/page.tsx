import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ENDPOINTS } from '@/lib/api';
import { WordPressTour } from '@/types/wordpress';
import { TourGallery } from '@/components/TourGallery';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchTourBySlug(slug: string) {
  const res = await fetch(`${ENDPOINTS.tour}`);
  const posts = await res.json();
  const tour = posts[0]?.acf?.tour_list?.find((t: WordPressTour) => slugify(t.tour_heading) === slug);
  if (!tour) return null;
  return {
    tour_heading: tour.tour_heading,
    tour_cover: tour.tour_cover,
    tour_full_description: tour.tour_full_description,
    gallery: tour.gallery || []
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  if (!params?.slug) return notFound();
  const tour = await fetchTourBySlug(params.slug);
  if (!tour) return notFound();

  return (
    <main className="min-h-screen bg-white">
      {/* Cover Image */}
      {tour.tour_cover && (
        <div className="relative w-full h-[60vh]">
          <Image
            src={tour.tour_cover.sizes?.large || tour.tour_cover.url}
            alt={tour.tour_cover.alt || tour.tour_heading}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-8">{tour.tour_heading}</h1>
        {/* Description */}
        {tour.tour_full_description && (
          <div 
            className="text-gray-700 text-base md:text-lg mb-8" 
            dangerouslySetInnerHTML={{ 
              __html: typeof tour.tour_full_description === 'string' 
                ? tour.tour_full_description 
                : '' 
            }} 
          />
        )}
        {/* Gallery */}
        <TourGallery gallery={tour.gallery} tourHeading={tour.tour_heading} />
      </div>
    </main>
  );
} 