import { WordPressPost, WordPressPage, WordPressCategory, WordPressTag, WordPressMedia } from '@/types/wordpress';

// WordPress API Configuration
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://ceylonicus.local/wp-json/wp/v2';
const AUTH_TOKEN = process.env.WORDPRESS_AUTH_TOKEN;

// API Endpoints
export const ENDPOINTS = {
  posts: `${API_URL}/posts`,
  pages: `${API_URL}/pages`,
  categories: `${API_URL}/categories`,
  tags: `${API_URL}/tags`,
  media: `${API_URL}/media`,
};

// API Headers
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
});

// Error handling wrapper
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    let errorJson;
    try {
      errorJson = JSON.parse(errorText);
    } catch {
      errorJson = errorText;
    }
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorJson || 'No error message returned'
    });
    throw new Error(
      (typeof errorJson === 'object' && errorJson?.message) ? errorJson.message : (errorJson || `API Error: ${response.status} ${response.statusText}`)
    );
  }
  return response.json();
}

// API Request Functions
export async function fetchPosts(page = 1, perPage = 10): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${API_URL}/posts?page=${page}&per_page=${perPage}&_embed`,
      {
        headers: {
          ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` })
        }
      }
    );
    return handleResponse<WordPressPost[]>(response);
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function fetchPost(slug: string): Promise<WordPressPost> {
  try {
    const response = await fetch(
      `${API_URL}/posts?slug=${slug}&_embed`,
      {
        headers: {
          ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` })
        }
      }
    );
    const posts = await handleResponse<WordPressPost[]>(response);
    if (!posts.length) throw new Error('Post not found');
    return posts[0];
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

export async function fetchPages(): Promise<WordPressPage[]> {
  try {
    const response = await fetch(
      `${API_URL}/pages?_embed&acf=true`,
      {
        headers: {
          ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` })
        }
      }
    );
    return handleResponse<WordPressPage[]>(response);
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
}

export async function fetchPage(slug: string): Promise<WordPressPage> {
  try {
    const response = await fetch(
      `${API_URL}/pages?slug=${slug}&_embed&acf=true`,
      {
        headers: {
          ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` })
        }
      }
    );
    const pages = await handleResponse<WordPressPage[]>(response);
    if (!pages.length) throw new Error('Page not found');
    return pages[0];
  } catch (error) {
    console.error('Error fetching page:', error);
    throw error;
  }
}

export async function fetchCategories(): Promise<WordPressCategory[]> {
  try {
    const response = await fetch(`${API_URL}/categories`);
    return handleResponse<WordPressCategory[]>(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function fetchTags(): Promise<WordPressTag[]> {
  try {
    const response = await fetch(`${API_URL}/tags`);
    return handleResponse<WordPressTag[]>(response);
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}

export async function fetchMedia(id: number): Promise<WordPressMedia> {
  try {
    const response = await fetch(`${API_URL}/media/${id}`);
    return handleResponse<WordPressMedia>(response);
  } catch (error) {
    console.error('Error fetching media:', error);
    throw error;
  }
}

export async function fetchHeaderMenu() {
  const response = await fetch(`${API_URL}/menu?slug=main-menu&acf_format=standard`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!data || !data.length) return null;
  return data[0].acf;
} 