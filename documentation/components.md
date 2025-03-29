# Component Documentation

This document provides information about the UI components used in the Unjica project.

## Component Structure

The project's components are organized in the following structure:

```
src/
└── components/
    └── ui/
        ├── Button.tsx
        ├── GradientText.tsx
        ├── Container.tsx
        ├── BlurredBackground.tsx
        ├── Navbar.tsx
        ├── Footer.tsx
        ├── LoadingSpinner.tsx
        ├── ErrorBoundary.tsx
        ├── Modal.tsx
        ├── Toast.tsx
        ├── art-news/
        │   ├── ArtNewsCard.tsx
        │   ├── ArtNewsList.tsx
        │   ├── FeaturedArticle.tsx
        │   └── digest/
        │       ├── DigestArticleCard.tsx
        │       ├── DigestArticleCardSkeleton.tsx
        │       └── DigestArticleList.tsx
        ├── comments/
        │   ├── Comment.tsx
        │   ├── CommentList.tsx
        │   ├── CommentForm.tsx
        │   └── CommentSkeleton.tsx
        ├── reactions/
        │   ├── ReactionButton.tsx
        │   └── ReactionCounter.tsx
        ├── admin/
        │   ├── AdminControls.tsx
        │   └── AdminDashboard.tsx
        └── social/
            ├── ShareButton.tsx
            └── FacebookShare.tsx
```

## Core Components

### Button

The Button component provides a customizable button element with various styles.

**Props:**
- `variant`: The visual style of the button (default, primary, outline, etc.)
- `size`: The size of the button (small, medium, large)
- `children`: The content to render inside the button
- `asChild`: When true, the component will render its child directly with all props passed to it
- `isLoading`: When true, shows a loading spinner
- `disabled`: When true, disables the button
- `onClick`: Click event handler
- `className`: Additional CSS classes
- ...other standard button props

**Usage:**
```tsx
import { Button } from '@/components/ui/Button';

// Default button
<Button>Click me</Button>

// Primary variant with loading state
<Button variant="primary" isLoading={true}>Submit</Button>

// Small outline button
<Button variant="outline" size="sm">Cancel</Button>

// Disabled button
<Button disabled>Not Available</Button>
```

### GradientText

Renders text with a gradient effect.

**Props:**
- `children`: The text content
- `className`: Additional CSS classes
- `gradient`: Custom gradient colors (optional)
- `animate`: Whether to animate the gradient (default: true)
- ...other text element props

**Usage:**
```tsx
import { GradientText } from '@/components/ui/GradientText';

<GradientText>Beautiful Gradient Text</GradientText>

// With custom gradient
<GradientText gradient="from-blue-500 to-purple-500">
  Custom Gradient Text
</GradientText>
```

### Container

A layout component that centers and constrains content width.

**Props:**
- `children`: The content to be contained
- `className`: Additional CSS classes
- `maxWidth`: Maximum width of the container (sm, md, lg, xl, 2xl)
- `padding`: Padding size (sm, md, lg, xl)
- ...other div props

**Usage:**
```tsx
import { Container } from '@/components/ui/Container';

<Container maxWidth="xl" padding="lg">
  <h1>My Page Content</h1>
  <p>Some text here...</p>
</Container>
```

### BlurredBackground

Creates a stylish blurred background effect.

**Props:**
- `children`: Optional content to render inside the blurred area
- `className`: Additional CSS classes
- `blur`: Blur intensity (sm, md, lg)
- `opacity`: Background opacity (0-100)
- ...other div props

**Usage:**
```tsx
import { BlurredBackground } from '@/components/ui/BlurredBackground';

<BlurredBackground blur="lg" opacity={80}>
  <div>Content with blurred background</div>
</BlurredBackground>
```

### LoadingSpinner

A customizable loading spinner component.

**Props:**
- `size`: Size of the spinner (sm, md, lg)
- `color`: Color of the spinner
- `className`: Additional CSS classes

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

<LoadingSpinner size="md" color="primary" />
```

### ErrorBoundary

A React error boundary component for graceful error handling.

**Props:**
- `children`: The content to wrap
- `fallback`: Custom fallback component
- `onError`: Error handler function

**Usage:**
```tsx
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <MyComponent />
</ErrorBoundary>
```

### Modal

A modal dialog component for displaying content in an overlay.

**Props:**
- `isOpen`: Whether the modal is open
- `onClose`: Close handler function
- `title`: Modal title
- `children`: Modal content
- `size`: Modal size (sm, md, lg, xl)
- `className`: Additional CSS classes

**Usage:**
```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="My Modal"
  size="md"
>
  <div>Modal content here</div>
</Modal>
```

### Toast

A toast notification component for displaying messages.

**Props:**
- `message`: Toast message
- `type`: Toast type (success, error, warning, info)
- `duration`: Display duration in milliseconds
- `onClose`: Close handler function
- `className`: Additional CSS classes

**Usage:**
```tsx
import { Toast } from '@/components/ui/Toast';

<Toast
  message="Operation successful!"
  type="success"
  duration={3000}
  onClose={() => {}}
/>
```

## Art News Components

### ArtNewsCard

Displays a single art news item with image, title, description, source, and tags.

**Props:**
- `news`: Art news item object
- `className`: Additional CSS classes
- `showSource`: Whether to show the source
- `showTags`: Whether to show tags
- `onClick`: Click handler function

**Usage:**
```tsx
import { ArtNewsCard } from '@/components/ui/art-news/ArtNewsCard';
import type { ArtNewsItem } from '@/lib/agents/artNewsAgent';

const newsItem: ArtNewsItem = {
  id: '1',
  title: 'New Exhibition Opening',
  description: 'A new exhibition featuring...',
  source: 'Art Magazine',
  url: 'https://example.com',
  publishedAt: '2023-06-01T12:00:00Z',
  tags: ['exhibition', 'modern art']
};

<ArtNewsCard 
  news={newsItem}
  showSource={true}
  showTags={true}
  onClick={() => handleClick(newsItem)}
/>
```

### ArtNewsList

Displays a grid of art news items with pagination support.

**Props:**
- `initialNews`: Initial array of news items
- `className`: Additional CSS classes
- `itemsPerPage`: Number of items per page
- `showPagination`: Whether to show pagination
- `onLoadMore`: Load more handler function

**Usage:**
```tsx
import { ArtNewsList } from '@/components/ui/art-news/ArtNewsList';

// For client-side loading
<ArtNewsList itemsPerPage={12} showPagination={true} />

// With server-provided initial data
<ArtNewsList 
  initialNews={newsItems}
  itemsPerPage={12}
  showPagination={true}
  onLoadMore={handleLoadMore}
/>
```

### FeaturedArticle

Displays a featured article with enhanced styling.

**Props:**
- `article`: Generated article object
- `className`: Additional CSS classes
- `showImage`: Whether to show the article image
- `showSummary`: Whether to show the summary
- `showTags`: Whether to show tags

**Usage:**
```tsx
import { FeaturedArticle } from '@/components/ui/art-news/FeaturedArticle';
import type { GeneratedArticle } from '@/lib/agents/models/generatedArticle';

const article: GeneratedArticle = {
  // article properties
};

<FeaturedArticle 
  article={article}
  showImage={true}
  showSummary={true}
  showTags={true}
/>
```

### DigestArticleCard

Displays an AI-generated digest article with expandable content.

**Props:**
- `article`: Generated article object
- `className`: Additional CSS classes
- `isExpanded`: Whether the article should be expanded by default
- `showImage`: Whether to show the article image
- `showSummary`: Whether to show the summary
- `showTags`: Whether to show tags
- `onExpand`: Expand handler function

**Usage:**
```tsx
import { DigestArticleCard } from '@/components/ui/art-news/digest/DigestArticleCard';
import type { GeneratedArticle } from '@/lib/agents/models/generatedArticle';

const article: GeneratedArticle = {
  // article properties
};

<DigestArticleCard 
  article={article}
  isExpanded={false}
  showImage={true}
  showSummary={true}
  showTags={true}
  onExpand={() => handleExpand(article)}
/>
```

### DigestArticleCardSkeleton

A loading skeleton for the DigestArticleCard component.

**Props:**
- `className`: Additional CSS classes

**Usage:**
```tsx
import { DigestArticleCardSkeleton } from '@/components/ui/art-news/digest/DigestArticleCardSkeleton';

<DigestArticleCardSkeleton />
```

### DigestArticleList

Displays a list of digest articles with infinite scroll.

**Props:**
- `initialArticles`: Initial array of articles
- `className`: Additional CSS classes
- `itemsPerPage`: Number of items per page
- `onLoadMore`: Load more handler function
- `showLoading`: Whether to show loading state

**Usage:**
```tsx
import { DigestArticleList } from '@/components/ui/art-news/digest/DigestArticleList';
import type { GeneratedArticle } from '@/lib/agents/models/generatedArticle';

<DigestArticleList 
  initialArticles={articles}
  itemsPerPage={12}
  onLoadMore={handleLoadMore}
  showLoading={true}
/>
```

## Comments Components

### Comment

Displays a single comment with user information and content.

**Props:**
- `comment`: Comment object
- `className`: Additional CSS classes
- `showUser`: Whether to show user information
- `showTimestamp`: Whether to show timestamp
- `onReply`: Reply handler function

**Usage:**
```tsx
import { Comment } from '@/components/ui/comments/Comment';
import type { Comment as CommentType } from '@prisma/client';

const comment: CommentType = {
  // comment properties
};

<Comment 
  comment={comment}
  showUser={true}
  showTimestamp={true}
  onReply={() => handleReply(comment)}
/>
```

### CommentList

Displays a list of comments with nested replies.

**Props:**
- `comments`: Array of comment objects
- `className`: Additional CSS classes
- `showUser`: Whether to show user information
- `showTimestamp`: Whether to show timestamp
- `onReply`: Reply handler function
- `onLoadMore`: Load more handler function

**Usage:**
```tsx
import { CommentList } from '@/components/ui/comments/CommentList';
import type { Comment } from '@prisma/client';

<CommentList 
  comments={comments}
  showUser={true}
  showTimestamp={true}
  onReply={handleReply}
  onLoadMore={handleLoadMore}
/>
```

### CommentForm

A form component for creating new comments.

**Props:**
- `articleId`: ID of the article to comment on
- `parentId`: ID of the parent comment (for replies)
- `className`: Additional CSS classes
- `onSubmit`: Submit handler function
- `placeholder`: Input placeholder text
- `showCancel`: Whether to show cancel button

**Usage:**
```tsx
import { CommentForm } from '@/components/ui/comments/CommentForm';

<CommentForm 
  articleId="article123"
  parentId="comment123"
  placeholder="Write a comment..."
  showCancel={true}
  onSubmit={handleSubmit}
/>
```

### CommentSkeleton

A loading skeleton for the Comment component.

**Props:**
- `className`: Additional CSS classes
- `showUser`: Whether to show user skeleton
- `showTimestamp`: Whether to show timestamp skeleton

**Usage:**
```tsx
import { CommentSkeleton } from '@/components/ui/comments/CommentSkeleton';

<CommentSkeleton showUser={true} showTimestamp={true} />
```

## Reactions Components

### ReactionButton

A button component for adding reactions to articles or comments.

**Props:**
- `type`: Reaction type (like, love, wow, etc.)
- `count`: Current reaction count
- `isActive`: Whether the reaction is active
- `className`: Additional CSS classes
- `onClick`: Click handler function
- `disabled`: Whether the button is disabled

**Usage:**
```tsx
import { ReactionButton } from '@/components/ui/reactions/ReactionButton';

<ReactionButton 
  type="like"
  count={10}
  isActive={true}
  onClick={() => handleReaction('like')}
/>
```

### ReactionCounter

Displays the total count of reactions.

**Props:**
- `counts`: Object containing reaction counts
- `className`: Additional CSS classes
- `showLabels`: Whether to show reaction labels
- `showIcons`: Whether to show reaction icons

**Usage:**
```tsx
import { ReactionCounter } from '@/components/ui/reactions/ReactionCounter';

<ReactionCounter 
  counts={{ like: 10, love: 5, wow: 2 }}
  showLabels={true}
  showIcons={true}
/>
```

## Admin Components

### AdminControls

A component for admin-specific controls and actions.

**Props:**
- `generateDigest`: Function to generate new digest
- `isGenerating`: Whether a digest is being generated
- `className`: Additional CSS classes
- `showAdvanced`: Whether to show advanced controls

**Usage:**
```tsx
import { AdminControls } from '@/components/ui/admin/AdminControls';

<AdminControls 
  generateDigest={handleGenerateDigest}
  isGenerating={false}
  showAdvanced={true}
/>
```

### AdminDashboard

A dashboard component for admin users.

**Props:**
- `stats`: Dashboard statistics
- `className`: Additional CSS classes
- `showCharts`: Whether to show charts
- `showTables`: Whether to show data tables

**Usage:**
```tsx
import { AdminDashboard } from '@/components/ui/admin/AdminDashboard';

<AdminDashboard 
  stats={dashboardStats}
  showCharts={true}
  showTables={true}
/>
```

## Social Components

### ShareButton

A button component for sharing content.

**Props:**
- `url`: URL to share
- `title`: Share title
- `description`: Share description
- `className`: Additional CSS classes
- `platforms`: Array of platforms to show
- `onShare`: Share handler function

**Usage:**
```tsx
import { ShareButton } from '@/components/ui/social/ShareButton';

<ShareButton 
  url="https://example.com/article"
  title="Article Title"
  description="Article description"
  platforms={['facebook', 'twitter']}
  onShare={handleShare}
/>
```

### FacebookShare

A component for sharing content to Facebook.

**Props:**
- `url`: URL to share
- `title`: Share title
- `description`: Share description
- `image`: Share image URL
- `className`: Additional CSS classes
- `onShare`: Share handler function

**Usage:**
```tsx
import { FacebookShare } from '@/components/ui/social/FacebookShare';

<FacebookShare 
  url="https://example.com/article"
  title="Article Title"
  description="Article description"
  image="https://example.com/image.jpg"
  onShare={handleShare}
/>
```

## Component Usage Guidelines

### Composition Patterns

Components are designed to be composable. For example:

```tsx
<Container>
  <h1><GradientText>Welcome</GradientText></h1>
  <Button>Get Started</Button>
</Container>
```

### Styling Components

Components accept a `className` prop for additional styling:

```tsx
<Button className="mt-4 w-full">Submit</Button>
```

### Accessibility

All components are built with accessibility in mind:

- Buttons provide proper focus states
- Interactive elements have appropriate ARIA attributes
- Keyboard navigation is supported
- Color contrast meets WCAG guidelines
- Screen reader support is implemented
- Focus management is handled properly

### Best Practices

1. Use the provided UI components rather than creating new ones for consistent design
2. Leverage the component props for variations rather than custom styling where possible
3. Follow the established patterns when creating new components
4. Maintain proper typings with TypeScript for all component props
5. Include proper error handling and loading states
6. Implement proper accessibility features
7. Use composition over inheritance
8. Keep components focused and single-responsibility

## Creating New Components

When creating new components:

1. Place them in the appropriate directory under `src/components`
2. Use TypeScript for type safety
3. Follow the project's naming conventions
4. Include proper JSDoc comments
5. Make components reusable and composable
6. Test the component with various props and scenarios
7. Implement proper error boundaries
8. Include loading states and skeletons
9. Ensure accessibility compliance
10. Add proper documentation

## Component Testing

Components should be tested using:

1. Unit tests for component logic
2. Integration tests for component interactions
3. Accessibility tests
4. Visual regression tests
5. Performance tests

Example test structure:

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalled();
  });

  it('is accessible', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveAttribute('role', 'button');
    expect(button).toHaveAttribute('tabindex', '0');
  });
});
``` 