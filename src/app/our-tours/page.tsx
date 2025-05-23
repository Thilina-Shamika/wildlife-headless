import Image from 'next/image';
import { OurTours } from '@/components/OurTours';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function OurToursPage() {
  // Fetch the page data from the endpoint
  let pageData: any = null;
  try {
    const res = await fetch('http://ceylonicus.local/wp-json/wp/v2/pages?slug=our-tours', { cache: 'no-store' });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].acf) {
      pageData = data[0].acf;
    }
  } catch (e) {
    // fallback to null
  }

  // Fallback data
  const fallback = {
    cover_image: {
      url: 'http://ceylonicus.local/wp-content/uploads/2025/05/hu-chen-0LwfbRtQ-ac-unsplash.jpg',
      alt: '',
      width: 1920,
      height: 1284,
    },
    sub_heading: 'Professional Naturalist & Driver with a',
    heading: 'Our Tours & Experiences',
  };

  const cover = pageData && typeof pageData === 'object' && 'cover_image' in pageData && pageData.cover_image ? pageData.cover_image : fallback.cover_image;
  const subHeading = pageData && typeof pageData.sub_heading === 'string' ? pageData.sub_heading : fallback.sub_heading;
  const heading = pageData && typeof pageData.heading === 'string' ? pageData.heading : fallback.heading;

  // Fetch tours data (CPT)
  let toursData: any[] = [];
  try {
    const res = await fetch('http://ceylonicus.local/wp-json/wp/v2/Tour', { cache: 'no-store' });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].acf && Array.isArray(data[0].acf.tour_list)) {
      toursData = data[0].acf.tour_list.map((tour: any) => ({
        ...tour,
        slug: slugify(tour.tour_heading),
      }));
    }
  } catch (e) {
    // fallback to []
  }

  return (
    <main className="min-h-screen bg-[#f9fafb]">
      {/* Cover Image */}
      <div className="relative w-full h-80 md:h-[400px] lg:h-[500px]">
        <Image
          src={String(cover.url)}
          alt={String(cover.alt)}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
          <h2 className="text-lg md:text-2xl font-semibold mb-2 drop-shadow-lg">{subHeading}</h2>
          <h1 className="text-3xl md:text-7xl font-bold mb-4 text-center drop-shadow-lg">{heading}</h1>
        </div>
      </div>
      {/* Our Tours Cards Section */}
      <div className="container mx-auto px-4 py-12">
        <OurTours tours={toursData} subheading={subHeading} heading={heading} />
      </div>
    </main>
  );
} 