import { GalleryVerticalEnd } from "lucide-react";
import { Building2, Camera, ImageIcon, Palette, Users } from "lucide-react";
import { Calendar } from "lucide-react";
import { getTopicSlug } from "../utils/topicMapper";

export interface Category {
  name: string;
  href: string;
  primaryTopic: string;
  slug: string;
  icon: { 
    icon: React.ElementType; 
    color: string 
  };
}

const primaryTopics = [
  'Contemporary Art',
  'Exhibition',
  'Painting',
  'Artist',
  'Photography',
  'Museum',
  'Gallery',
]
const getTopicIcon = (topic: string) => {
  switch (topic) {
    case 'Contemporary Art': 
      return { icon: Palette, color: 'from-blue-500/20 to-purple-500/20' }
    case 'Exhibitions': 
      return { icon: Calendar, color: 'from-green-500/20 to-emerald-500/20' }
    case 'Painting': 
      return { icon: ImageIcon, color: 'from-orange-500/20 to-red-500/20' }
    case 'Artists': 
      return { icon: Users, color: 'from-pink-500/20 to-rose-500/20' }
    case 'Photography': 
      return { icon: Camera, color: 'from-cyan-500/20 to-blue-500/20' }
    case 'Museums': 
      return { icon: Building2, color: 'from-yellow-500/20 to-amber-500/20' }
    case 'Gallery': 
      return { icon: GalleryVerticalEnd, color: 'from-violet-500/20 to-purple-500/20' }
    default:
      return { icon: Palette, color: 'from-blue-500/20 to-purple-500/20' }
  }
};

export const categories: Category[] = primaryTopics.map(topic => ({
  name: topic,
  href: `/category/${getTopicSlug(topic)}`,
  primaryTopic: topic,
  slug: getTopicSlug(topic),
  icon: getTopicIcon(topic)
}));