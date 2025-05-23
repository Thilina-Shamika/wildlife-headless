import Image from 'next/image';
import Link from 'next/link';
import WhyChooseUsAccordion from '@/components/WhyChooseUsAccordion';
import OurToursSlider from '@/components/OurToursSlider';
import { Testimonials } from '@/components/Testimonials';
import { fetchPages, ENDPOINTS } from '@/lib/api';

async function getAboutData() {
  try {
    const pages = await fetchPages();
    const aboutPage = pages.find((page) => page.slug === 'about');
    return aboutPage?.acf || {};
  } catch (error) {
    console.error('Error fetching about page data:', error);
    return {};
  }
}

async function getToursData() {
  try {
    const tourRes = await fetch(`${ENDPOINTS.tour}`);
    const tourPosts = await tourRes.json();
    return tourPosts[0]?.acf || {};
  } catch (error) {
    console.error('Error fetching tours data:', error);
    return {};
  }
}

// --- Add sample tours data (from API) ---
const toursApiData = {
  sub_heading: "Professional Naturalist & Driver with a",
  heading: "Our Tours & Experiences",
  tour_list: [
    {
      tour_heading: "NIGHT SAFARI DRIVE",
      tour_image_portrait: {
        url: "http://ceylonicus.local/wp-content/uploads/2025/05/image-7.png",
        alt: "image (7)",
        width: 298,
        height: 447,
      },
      tour_short_description: "Included: Professional Naturalist & Driver 4x4 Jeeр | Night Watching Equipment",
    },
    {
      tour_heading: "SUNDOWNER WILD COCKTAIL",
      tour_image_portrait: {
        url: "http://ceylonicus.local/wp-content/uploads/2025/05/image-8.png",
        alt: "image (8)",
        width: 298,
        height: 447,
      },
      tour_short_description: "Included: Cocktails, Mocktails, Naturalist & Driver",
    },
    {
      tour_heading: "BIRD TRAIL",
      tour_image_portrait: {
        url: "http://ceylonicus.local/wp-content/uploads/2025/05/image-9.png",
        alt: "image (9)",
        width: 298,
        height: 447,
      },
      tour_short_description: "Included: Naturalist, Binoculars, Water Bottles",
    },
    {
      tour_heading: "NIGHT WALK",
      tour_image_portrait: {
        url: "http://ceylonicus.local/wp-content/uploads/2025/05/image-10.png",
        alt: "image (10)",
        width: 298,
        height: 447,
      },
      tour_short_description: "Included: Professional Naturalist / Night Watching Equipment",
    },
    {
      tour_heading: "CYCLING TO \"HENA\"",
      tour_image_portrait: {
        url: "http://ceylonicus.local/wp-content/uploads/2025/05/image-8.png",
        alt: "image (8)",
        width: 298,
        height: 447,
      },
      tour_short_description: "Included: Coconut Roti preparation experience, Refreshments, Naturalist,",
    },
    {
      tour_heading: "BIKE RIDE TO VILLAGE",
      tour_image_portrait: {
        url: "http://ceylonicus.local/wp-content/uploads/2025/05/image-9.png",
        alt: "image (9)",
        width: 298,
        height: 447,
      },
      tour_short_description: "Included: Proffesional Naturalist, Branded Bikes, Water & Refreshment",
    },
    {
      tour_heading: "JUNGLE KAYAKING",
      tour_image_portrait: {
        url: "http://ceylonicus.local/wp-content/uploads/2025/05/image-9.png",
        alt: "image (9)",
        width: 298,
        height: 447,
      },
      tour_short_description: "Included: Naturalist, Safety jackets, Refreshments",
    },
  ],
};

export default async function AboutPage() {
  const [aboutData, toursData] = await Promise.all([
    getAboutData(),
    getToursData(),
  ]);

  // Fetch testimonials from the provided endpoint
  let testimonialsHeading = 'Testimonials';
  let testimonialsSubheading = 'What our customers say about us';
  let testimonialsList = [];
  try {
    const res = await fetch('http://ceylonicus.local/wp-json/wp/v2/testimonial', { cache: 'no-store' });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].acf) {
      testimonialsHeading = data[0].acf.heading || testimonialsHeading;
      testimonialsSubheading = data[0].acf.subheading || testimonialsSubheading;
      testimonialsList = data[0].acf.testimonial_list || [];
    }
  } catch (e) {
    // fallback to empty testimonials
  }

  // Fallback data in case API fails
  const fallbackData = {
    cover_image: {
      url: "http://ceylonicus.local/wp-content/uploads/2025/05/dave-goudreau-X09X2Ghhz30-unsplash.jpg",
      alt: "dave-goudreau-X09X2Ghhz30-unsplash",
      width: 1920,
      height: 1280,
    },
    sub_heading: "About Us",
    heading: "Discover about our Company",
    description: `We are a team of experienced naturalists and adventure guides dedicated to offering unique, eco-friendly tours that bring you closer to nature. Whether you're looking for a thrilling night safari, a peaceful kayaking experience, or a magical sunset drink by the water, our team ensures every trip is unforgettable.`,
    button_text: "Book a Tour",
    button_url: "/book-a-tour",
    section_image: {
      url: "http://ceylonicus.local/wp-content/uploads/2025/05/image-6.png",
      alt: "image (6)",
      width: 357,
      height: 600,
    },
    steps: [
      {
        step_number: "01",
        step_heading: "Tell us what you want to do",
        image_or_icon: {
          url: "http://ceylonicus.local/wp-content/uploads/2025/05/feature-1.png",
          alt: "feature-1",
          width: 56,
          height: 56,
        },
        description: "Fully layered dolor sit amet, consectetur adipisicing elit. Facere, nobis, id expedita dolores officiis laboriosam.",
      },
      {
        step_number: "02",
        step_heading: "Share your travel preference",
        image_or_icon: {
          url: "http://ceylonicus.local/wp-content/uploads/2025/05/feature-2.png",
          alt: "feature-2",
          width: 67,
          height: 70,
        },
        description: "Fully layered dolor sit amet, consectetur adipisicing elit. Facere, nobis, id expedita dolores officiis laboriosam.",
      },
      {
        step_number: "03",
        step_heading: "We'll give you recommendations",
        image_or_icon: {
          url: "http://ceylonicus.local/wp-content/uploads/2025/05/feature-3.png",
          alt: "feature-3",
          width: 78,
          height: 56,
        },
        description: "Fully layered dolor sit amet, consectetur adipisicing elit. Facere, nobis, id expedita dolores officiis laboriosam.",
      },
    ],
  };

  const whyChooseUsList = [
    {
      title: "Expert Naturalist Guides",
      description: "Our guides are highly trained and passionate about wildlife and nature."
    },
    {
      title: "Unique & Personalized Adventures",
      description: "Every tour is tailored to your interests and comfort."
    },
    {
      title: "Eco-Conscious & Sustainable Tourism",
      description: "We prioritize sustainability and responsible travel."
    },
    {
      title: "Small Groups for Intimate Experiences",
      description: "Enjoy a more personal and immersive adventure with our small group sizes."
    },
    {
      title: "Safety & Comfort First",
      description: "Your safety and comfort are our top priorities on every tour."
    },
    {
      title: "Local Knowledge, Hidden Gems",
      description: "Discover places and stories only locals know, for a truly authentic experience."
    }
  ];

  // Use API data if available, otherwise use fallback data
  const finalAboutData = (aboutData && typeof aboutData === 'object' && aboutData !== null && 'cover_image' in aboutData && aboutData.cover_image && typeof aboutData.cover_image === 'object') ? aboutData : fallbackData;
  const finalToursData = (toursData && typeof toursData === 'object' && toursData !== null && 'tour_list' in toursData && Array.isArray(toursData.tour_list)) ? toursData : toursApiData;

  // Helper to safely get steps array
  const stepsArray = Array.isArray(finalAboutData.steps) ? finalAboutData.steps : fallbackData.steps;

  return (
    <main className="min-h-screen bg-white">
      {/* Cover Image */}
      <div className="relative w-full h-80 md:h-[400px] lg:h-[500px]">
        <Image
          src={String(finalAboutData.cover_image && typeof finalAboutData.cover_image === 'object' && 'url' in finalAboutData.cover_image ? finalAboutData.cover_image.url : fallbackData.cover_image.url)}
          alt={String(finalAboutData.cover_image && typeof finalAboutData.cover_image === 'object' && 'alt' in finalAboutData.cover_image ? finalAboutData.cover_image.alt : fallbackData.cover_image.alt)}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
          <h1 className="text-3xl md:text-7xl font-bold mb-4 text-center drop-shadow-lg">About Us</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-sm md:text-sm font-semibold mb-2 tracking-widest uppercase text-primary">{typeof finalAboutData.sub_heading === 'string' ? finalAboutData.sub_heading : fallbackData.sub_heading}</h2>
          <h3 className="text-2xl md:text-7xl font-bold mb-4 text-gray-900">{typeof finalAboutData.heading === 'string' ? finalAboutData.heading : fallbackData.heading}</h3>
          <div className="text-gray-700 text-base md:text-lg mb-8" dangerouslySetInnerHTML={{ __html: typeof finalAboutData.description === 'string' ? finalAboutData.description : fallbackData.description }} />
          <Link href={typeof finalAboutData.button_url === 'string' ? finalAboutData.button_url : fallbackData.button_url}>
            <button className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition">
              {typeof finalAboutData.button_text === 'string' ? finalAboutData.button_text : fallbackData.button_text}
            </button>
          </Link>
        </div>
        <div className="flex justify-center">
          <Image
            src={String(finalAboutData.section_image && typeof finalAboutData.section_image === 'object' && 'url' in finalAboutData.section_image ? finalAboutData.section_image.url : fallbackData.section_image.url)}
            alt={String(finalAboutData.section_image && typeof finalAboutData.section_image === 'object' && 'alt' in finalAboutData.section_image ? finalAboutData.section_image.alt : fallbackData.section_image.alt)}
            width={Number(finalAboutData.section_image && typeof finalAboutData.section_image === 'object' && 'width' in finalAboutData.section_image ? finalAboutData.section_image.width : fallbackData.section_image.width)}
            height={Number(finalAboutData.section_image && typeof finalAboutData.section_image === 'object' && 'height' in finalAboutData.section_image ? finalAboutData.section_image.height : fallbackData.section_image.height)}
            className="rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Steps Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-sm md:text-sm font-semibold mb-2 tracking-widest uppercase text-primary text-center">3 steps for the perfect trip</h2>
        <h3 className="text-2xl md:text-7xl font-bold mb-8 text-gray-900 text-center">Find Travel Perfection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stepsArray.map((step: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Image
                  src={step.image_or_icon.url}
                  alt={step.image_or_icon.alt}
                  width={step.image_or_icon.width}
                  height={step.image_or_icon.height}
                  className="mr-4"
                />
                <span className="text-2xl font-bold text-primary">{step.step_number}</span>
              </div>
              <h4 className="text-xl font-bold mb-2">{step.step_heading}</h4>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Why choose us?</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-8">
          At Ceylonica, we don't just offer tours—we create unforgettable experiences that connect you with nature in the most authentic way. Here's why travelers choose us
        </p>
        <WhyChooseUsAccordion items={whyChooseUsList} />
      </div>

      {/* Our Tours Slider Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-sm md:text-sm font-semibold mb-2 tracking-widest uppercase text-primary text-center">{finalToursData.sub_heading}</h2>
        <h3 className="text-2xl md:text-7xl font-bold mb-8 text-gray-900 text-center">{finalToursData.heading}</h3>
        <OurToursSlider tours={finalToursData.tour_list} />
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-12">
        <Testimonials
          heading={testimonialsHeading}
          subheading={testimonialsSubheading}
          testimonials={testimonialsList}
        />
      </div>
    </main>
  );
} 