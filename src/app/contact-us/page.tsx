import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import ContactPageForm from '@/components/ContactPageForm';

export default async function ContactUsPage() {
  // Fetch the Contact Us page data
  let pageData: any = null;
  try {
    const res = await fetch('http://ceylonicus.local/wp-json/wp/v2/pages?slug=contact-us', { cache: 'no-store' });
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
      url: 'http://ceylonicus.local/wp-content/uploads/2025/05/contact-cover.jpg',
      alt: 'Contact Cover',
      width: 1920,
      height: 1280,
    },
    sub_heading: 'Contact Us',
    heading: 'Get in Touch',
    address: 'Address Line 01, Line 02, City, Country',
    phone: '+94 77 123 4567',
    email: 'info@ceylonicus.com',
  };

  const cover = pageData && typeof pageData === 'object' && 'cover_image' in pageData && pageData.cover_image ? pageData.cover_image : fallback.cover_image;
  const subHeading = pageData && typeof pageData.sub_heading === 'string' ? pageData.sub_heading : fallback.sub_heading;
  const heading = pageData && typeof pageData.heading === 'string' ? pageData.heading : fallback.heading;
  const address = pageData && typeof pageData.address === 'string' ? pageData.address : fallback.address;
  const phone = pageData && typeof pageData.phone === 'string' ? pageData.phone : fallback.phone;
  const email = pageData && typeof pageData.email === 'string' ? pageData.email : fallback.email;

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
      {/* Contact Info Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Contact Info */}
          <div className="space-y-6 self-center">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary mt-1" />
              <div>
                <div className="font-semibold text-gray-900">Address</div>
                <div className="text-gray-700">{address}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary mt-1" />
              <div>
                <div className="font-semibold text-gray-900">Phone</div>
                <div className="text-gray-700">{phone}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary mt-1" />
              <div>
                <div className="font-semibold text-gray-900">Email</div>
                <div className="text-gray-700">{email}</div>
              </div>
            </div>
          </div>
          {/* Right Column: Contact Page Form */}
          <div className="shadow-2xl rounded-xl p-4 md:p-8 flex items-center justify-center">
            <ContactPageForm />
          </div>
        </div>
      </div>
    </main>
  );
} 