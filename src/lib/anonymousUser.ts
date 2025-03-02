/**
 * Anonymous user utilities
 * 
 * These functions help manage anonymous user interactions by:
 * - Generating and storing a unique ID for anonymous users
 * - Checking if the user has interacted with specific content
 * - Tracking interactions to prevent multiple likes/comments
 */

// Constants
const ANON_ID_KEY = 'anonymousUserId';
const ANON_REACTIONS_KEY = 'anonymousReactions';

/**
 * Gets or creates an anonymous user ID
 */
export function getAnonymousId(): string {
  if (typeof window === 'undefined') {
    return ''; // Server-side, no localStorage
  }
  
  let anonId = localStorage.getItem(ANON_ID_KEY);
  
  if (!anonId) {
    // Generate a unique ID (timestamp + random string)
    anonId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem(ANON_ID_KEY, anonId);
  }
  
  return anonId;
}

/**
 * Tracks an anonymous reaction locally to prevent multiple interactions
 */
export function trackAnonymousReaction(articleId: string, commentId: string | null, type: string | null): void {
  if (typeof window === 'undefined') {
    return; // Server-side, no localStorage
  }
  
  // Get existing reactions
  const reactionsJson = localStorage.getItem(ANON_REACTIONS_KEY) || '{}';
  const reactions = JSON.parse(reactionsJson);
  
  // Create key for this content item
  const key = `${articleId}${commentId ? `_${commentId}` : ''}`;
  
  if (type === null) {
    // Remove reaction if nullifying
    delete reactions[key];
  } else {
    // Store the reaction type
    reactions[key] = type;
  }
  
  // Save back to localStorage
  localStorage.setItem(ANON_REACTIONS_KEY, JSON.stringify(reactions));
}

/**
 * Checks if an anonymous user has already reacted to content
 */
export function getAnonymousReaction(articleId: string, commentId: string | null): string | null {
  if (typeof window === 'undefined') {
    return null; // Server-side, no localStorage
  }
  
  const reactionsJson = localStorage.getItem(ANON_REACTIONS_KEY) || '{}';
  const reactions = JSON.parse(reactionsJson);
  
  // Create key for this content item
  const key = `${articleId}${commentId ? `_${commentId}` : ''}`;
  
  return reactions[key] || null;
}

/**
 * Clears all stored anonymous reactions (useful for testing)
 */
export function clearAnonymousReactions(): void {
  if (typeof window === 'undefined') {
    return; // Server-side, no localStorage
  }
  
  localStorage.removeItem(ANON_REACTIONS_KEY);
} 