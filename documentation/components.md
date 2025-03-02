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
        └── art-news/
            ├── ArtNewsCard.tsx
            ├── ArtNewsList.tsx
            └── digest/
                └── DigestArticleCard.tsx
```

## Core Components

### Button

The Button component provides a customizable button element with various styles.

**Props:**
- `variant`: The visual style of the button (default, primary, outline, etc.)
- `size`: The size of the button (small, medium, large)
- `children`: The content to render inside the button
- `asChild`: When true, the component will render its child directly with all props passed to it
- ...other standard button props

**Usage:**
```tsx
import { Button } from '@/components/ui/Button';

// Default button
<Button>Click me</Button>

// Primary variant
<Button variant="primary">Submit</Button>

// Small outline button
<Button variant="outline" size="sm">Cancel</Button>
```

### GradientText

Renders text with a gradient effect.

**Props:**
- `children`: The text content
- `className`: Additional CSS classes
- ...other text element props

**Usage:**
```tsx
import { GradientText } from '@/components/ui/GradientText';

<GradientText>Beautiful Gradient Text</GradientText>
```

### Container

A layout component that centers and constrains content width.

**Props:**
- `children`: The content to be contained
- `className`: Additional CSS classes
- ...other div props

**Usage:**
```tsx
import { Container } from '@/components/ui/Container';

<Container>
  <h1>My Page Content</h1>
  <p>Some text here...</p>
</Container>
```

### BlurredBackground

Creates a stylish blurred background effect.

**Props:**
- `children`: Optional content to render inside the blurred area
- `className`: Additional CSS classes
- ...other div props

**Usage:**
```tsx
import { BlurredBackground } from '@/components/ui/BlurredBackground';

<BlurredBackground />
```

## Art News Components

### ArtNewsCard

Displays a single art news item with image, title, description, source, and tags.

**Props:**
- `news`: Art news item object
- `className`: Additional CSS classes

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

<ArtNewsCard news={newsItem} />
```

### ArtNewsList

Displays a grid of art news items with pagination support.

**Props:**
- `initialNews`: Initial array of news items
- `className`: Additional CSS classes

**Usage:**
```tsx
import { ArtNewsList } from '@/components/ui/art-news/ArtNewsList';

// For client-side loading
<ArtNewsList />

// With server-provided initial data
<ArtNewsList initialNews={newsItems} />
```

### DigestArticleCard

Displays an AI-generated digest article with expandable content.

**Props:**
- `article`: Generated article object
- `className`: Additional CSS classes
- `isExpanded`: Whether the article should be expanded by default

**Usage:**
```tsx
import { DigestArticleCard } from '@/components/ui/art-news/digest/DigestArticleCard';
import type { GeneratedArticle } from '@/lib/agents/models/generatedArticle';

const article: GeneratedArticle = {
  // article properties
};

<DigestArticleCard article={article} isExpanded={true} />
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

### Best Practices

1. Use the provided UI components rather than creating new ones for consistent design
2. Leverage the component props for variations rather than custom styling where possible
3. Follow the established patterns when creating new components
4. Maintain proper typings with TypeScript for all component props

## Creating New Components

When creating new components:

1. Place them in the appropriate directory under `src/components`
2. Use TypeScript for type safety
3. Follow the project's naming conventions
4. Include proper JSDoc comments
5. Make components reusable and composable
6. Test the component with various props and scenarios 