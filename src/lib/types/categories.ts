export interface Category {
  name: string;
  href: string;
  primaryTopic: string;
  slug: string;
}

export const categories: Category[] = [
  { name: 'Contemporary', href: '/category/contemporary', primaryTopic: 'Contemporary Art', slug: 'contemporary' },
  { name: 'Exhibitions', href: '/category/exhibitions', primaryTopic: 'Exhibition', slug: 'exhibitions' },
  { name: 'Painting', href: '/category/painting', primaryTopic: 'Painting', slug: 'painting' },
  { name: 'Artists', href: '/category/artists', primaryTopic: 'Artist', slug: 'artists' },
  { name: 'Photography', href: '/category/photography', primaryTopic: 'Photography', slug: 'photography' },
  { name: 'Museums', href: '/category/museums', primaryTopic: 'Museum', slug: 'museums' },
  { name: 'Gallery', href: '/category/gallery', primaryTopic: 'Gallery', slug: 'gallery' },
]; 