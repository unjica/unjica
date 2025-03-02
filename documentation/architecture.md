# Architecture

## Overall Structure

The Unjica project follows a modern React/Next.js architecture based on the Next.js App Router pattern. The project is organized as follows:

```
unjica/
├── src/                  # Main source code
│   ├── app/              # App Router pages and layouts
│   ├── components/       # React components
│   │   └── ui/           # UI component library
│   └── lib/              # Utility functions and helpers
├── public/               # Static assets
├── scripts/              # Build and utility scripts
├── documentation/        # Project documentation
└── ...                   # Configuration files
```

## Key Technologies

### Frontend

- **Next.js 15**: React framework with server-side rendering and static site generation
- **React 19**: UI library for building component-based interfaces
- **TypeScript**: Type-safe JavaScript superset
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Radix UI**: Accessible UI primitives

### Developer Tools

- **ESLint**: Code linting
- **PostCSS**: CSS transformation tool
- **TypeScript**: Static type checking

## Application Flow

1. The application entry point is in `src/app/layout.tsx` which serves as the root layout
2. Page components in the `src/app` directory define the routes using Next.js App Router conventions
3. UI components in `src/components/ui` are imported and used by page components
4. Utility functions in `src/lib` provide reusable functionality across the application

## Component Architecture

The UI components follow a hierarchical structure:

- **Layout Components**: Define the overall page structure (Container, etc.)
- **UI Elements**: Basic interface elements (Button, GradientText, etc.)
- **Feature Components**: Implement specific features or functionality
- **Page Components**: Compose other components to create complete pages

## Data Flow

The application uses React's state management patterns:

1. Local state with `useState` for component-specific state
2. Props for passing data between components
3. Form submissions handled by asynchronous functions 
4. API calls to backend endpoints under `src/app/api`

## API Integration

The application implements API routes using Next.js API routes in the `src/app/api` directory:

- **Email Service**: Handles email subscriptions and sends messages using Nodemailer

## Performance Considerations

1. Use of Next.js for optimized rendering
2. Component-based architecture for code splitting
3. Framer Motion for optimized animations
4. Tailwind CSS for reduced CSS bundle size
5. TypeScript for type safety and developer experience

## Future Architecture Considerations

- State management solutions for more complex state
- Authentication and authorization
- Database integration
- Testing framework implementation 