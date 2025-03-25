export const topicMapper: Record<string, string> = {
  'Contemporary Art': 'contemporary',
  'Exhibitions': 'exhibitions',
  'Painting': 'painting',
  'Artists': 'artists',
  'Photography': 'photography',
  'Museums': 'museums',
  'Gallery': 'gallery'
};

export function getTopicSlug(topic: string): string {
  // If the topic exists in our mapper, use its mapped value
  if (topic in topicMapper) {
    return topicMapper[topic];
  }
  
  // Fallback: convert the topic to lowercase and replace spaces with hyphens
  return topic.toLowerCase().replace(/\s+/g, '-');
}

export function getTopicFromSlug(slug: string): string {
  // Find the original topic from the slug
  const entry = Object.entries(topicMapper).find(([_, value]) => value === slug);
  if (entry) {
    return entry[0];
  }
  
  // Fallback: convert the slug back to a title case string
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} 