export interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: WordPressAuthor[];
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: WordPressTerm[][];
  };
}

export interface WordPressPage {
  id: number;
  date: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  acf?: {
    slider?: WordPressSliderSlide[];
    flexible_content?: WordPressSliderSlide[];
    [key: string]: unknown;
  };
  _embedded?: {
    author?: WordPressAuthor[];
    'wp:featuredmedia'?: WordPressMedia[];
  };
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  caption: {
    rendered: string;
  };
  description: {
    rendered: string;
  };
  media_type: string;
  mime_type: string;
  source_url: string;
  _embedded?: {
    author?: WordPressAuthor[];
  };
}

export interface WordPressAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    [key: string]: string;
  };
}

export interface WordPressTerm {
  id: number;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WordPressSliderImage {
  ID: number;
  id: number;
  title: string;
  filename: string;
  url: string;
  alt: string;
  sizes: {
    large: string;
    'large-width': number;
    'large-height': number;
    medium: string;
    'medium-width': number;
    'medium-height': number;
    thumbnail: string;
    'thumbnail-width': number;
    'thumbnail-height': number;
  };
}

export interface WordPressSliderSlide {
  acf_fc_layout: 'slide';
  image: WordPressSliderImage;
  title: string;
  description: string;
  link: {
    url: string;
    title: string;
    target: string;
  };
  button_text: string;
}

export interface WordPressHomePage extends WordPressPage {
  acf: {
    slider?: WordPressSliderSlide[];
    flexible_content?: WordPressSliderSlide[];
    sub_heading?: string;
    main_heading?: string;
    short_description?: string;
    button_link?: {
      url: string;
      title: string;
      target: string;
    };
    button_text?: string;
    center_image?: WordPressSliderImage;
    why_description?: string;
    why_us_faq?: WordPressAboutUsFAQ[];
  };
}

export interface WordPressAboutUsFAQ {
  acf_fc_layout: 'faq';
  faq_title: string;
  faq_description: string;
}

export interface WordPressAboutUs {
  sub_heading: string;
  main_heading: string;
  short_description: string;
  button_link: {
    url: string;
    title: string;
    target: string;
  };
  button_text: string;
  center_image: WordPressSliderImage;
  why_description: string;
  why_us_faq: WordPressAboutUsFAQ[];
}

export interface WordPressTourImage {
  ID: number;
  id: number;
  title: string;
  filename: string;
  url: string;
  alt: string;
  sizes: {
    large: string;
    'large-width': number;
    'large-height': number;
    medium: string;
    'medium-width': number;
    'medium-height': number;
    thumbnail: string;
    'thumbnail-width': number;
    'thumbnail-height': number;
  };
}

export interface WordPressTour {
  acf_fc_layout: 'tours';
  tour_heading: string;
  tour_image_portrait: WordPressTourImage;
  tour_cover: WordPressTourImage;
  tour_short_description: string;
  tour_full_description: string;
  gallery: WordPressTourImage[];
}

export interface WordPressTourPost {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    tour_list: WordPressTour[];
    sub_heading?: string;
    heading?: string;
  };
} 