import BookingForm from '@/components/BookingForm';
import Image from 'next/image';

export default async function BookATourPage() {
  // Fetch the Book a Tour page data
  let pageData: any = null;
  try {
    const res = await fetch('http://ceylonicus.local/wp-json/wp/v2/pages?slug=book-a-tour', { cache: 'no-store' });
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
      url: 'http://ceylonicus.local/wp-content/uploads/2025/05/seb-mooze-KS4TVO9UQiM-unsplash.jpg',
      alt: 'Book a Tour Cover',
      width: 1920,
      height: 1282,
    },
    sub_heading: 'Book a Tour',
    heading: 'Book your Tour Now',
  };

  const cover = pageData && typeof pageData === 'object' && 'cover_image' in pageData && pageData.cover_image ? pageData.cover_image : fallback.cover_image;
  const subHeading = pageData && typeof pageData.sub_heading === 'string' ? pageData.sub_heading : fallback.sub_heading;
  const heading = pageData && typeof pageData.heading === 'string' ? pageData.heading : fallback.heading;

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
      {/* Add more content here as needed */}

      <div className="container mx-auto px-4 py-12 flex justify-center">
  <BookingForm />
</div>


    </main>
  );
} 