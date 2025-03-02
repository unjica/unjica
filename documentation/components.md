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
        └── ...
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