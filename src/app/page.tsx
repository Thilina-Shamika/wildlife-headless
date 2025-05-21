import React from 'react';
import { Slider } from '@/components/Slider';
import { AboutUs } from '@/components/AboutUs';
import { OurTours } from '@/components/OurTours';
import ContactForm7 from '@/components/ContactForm7';
import { fetchPages, ENDPOINTS } from '@/lib/api';
import { WordPressHomePage, WordPressPage, WordPressSliderSlide, WordPressAboutUs, WordPressAboutUsFAQ, WordPressTourPost } from '@/types/wordpress';
import { Testimonials } from '@/components/Testimonials';

// Define the ACF type directly
type HomePageACF = {
  sub_heading?: string;
  main_heading?: string;
  'background-image'?: { url?: string };
  [key: string]: unknown;
};

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function Home() {
  try {
    const pages = await fetchPages();
    const homePage = pages.find((page: WordPressPage) => page.slug === 'home') as WordPressHomePage | undefined;
    const sliderData = homePage?.acf?.slider;
    const aboutData = homePage?.acf;

    console.log('Raw Home Page Data:', JSON.stringify(homePage, null, 2));
    console.log('About Data:', JSON.stringify(aboutData, null, 2));

    // Fetch tours from CPT
    const tourRes = await fetch(`${ENDPOINTS.tour}`);
    const tourPosts: WordPressTourPost[] = await tourRes.json();
    const tours = (tourPosts[0]?.acf?.tour_list || []).map((tour) => ({
      ...tour,
      slug: slugify(tour.tour_heading)
    }));

    // Fetch testimonials from CPT
    const testimonialRes = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/testimonial`);
    const testimonialPosts = await testimonialRes.json();
    const testimonialACF = testimonialPosts[0]?.acf || {};
    const testimonials = testimonialACF.testimonial_list || [];
    const testimonialsHeading = testimonialACF.heading || '';
    const testimonialsSubheading = testimonialACF.subheading || '';

    if (!sliderData || !Array.isArray(sliderData)) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <h1 className="text-4xl font-bold">Welcome to Wildlife</h1>
          <p className="mt-4 text-gray-600">No slider content found</p>
        </main>
      );
    }

    const slides = sliderData.filter(
      (section: WordPressSliderSlide) => section.acf_fc_layout === 'slide'
    );

    if (!slides.length) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <h1 className="text-4xl font-bold">Welcome to Wildlife</h1>
          <p className="mt-4 text-gray-600">No slides found</p>
        </main>
      );
    }

    // Prepare AboutUs data
    const aboutUsFaq = Array.isArray(aboutData?.why_us_faq)
      ? aboutData.why_us_faq.filter((item: WordPressAboutUsFAQ) => item.acf_fc_layout === 'faq')
      : [];
    
    console.log('AboutUs FAQ:', JSON.stringify(aboutUsFaq, null, 2));
    
    const aboutUs: WordPressAboutUs = {
      sub_heading: aboutData?.sub_heading || '',
      main_heading: aboutData?.main_heading || '',
      short_description: aboutData?.short_description || '',
      button_link: aboutData?.button_link || { url: '#', title: '', target: '_self' },
      button_text: aboutData?.button_text || '',
      center_image: aboutData?.center_image || {
        ID: 0,
        id: 0,
        title: '',
        filename: '',
        url: '',
        alt: '',
        sizes: {
          large: '',
          'large-width': 0,
          'large-height': 0,
          medium: '',
          'medium-width': 0,
          'medium-height': 0,
          thumbnail: '',
          'thumbnail-width': 0,
          'thumbnail-height': 0,
        },
      },
      why_description: aboutData?.why_description || '',
      why_us_faq: aboutUsFaq,
    };

    console.log('Final AboutUs Data:', JSON.stringify(aboutUs, null, 2));

    return (
      <main className="min-h-screen w-full">
        <Slider slides={slides} />
        <AboutUs about={aboutUs} />
        <OurTours 
          tours={tours} 
          subheading={tourPosts[0]?.acf?.sub_heading || ''}
          heading={tourPosts[0]?.acf?.heading || ''}
        />
       
        <ContactForm7 
          subheading={String((homePage?.acf as HomePageACF)?.subheading || '')}
          heading={String((homePage?.acf as HomePageACF)?.heading || '')}
          backgroundImage={(homePage?.acf as HomePageACF)?.['background-image']?.url || ''}
        />
         <Testimonials heading={testimonialsHeading} subheading={testimonialsSubheading} testimonials={testimonials} />
      </main>
    );
  } catch (error) {
    console.error('Error loading home page:', error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold text-red-600">Error Loading Content</h1>
        <p className="mt-4 text-gray-600">Please try again later</p>
      </main>
    );
  }
}
