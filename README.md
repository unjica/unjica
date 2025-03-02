# Unjica

A modern web application built with Next.js 15, React 19, and TypeScript.

## Overview

Unjica is a clean, modern web application that serves as a foundation for building dynamic web experiences. It features responsive design, interactive UI components with smooth animations, and email subscription functionality.

## Key Technologies

- **Next.js 15** - React framework with server-side rendering
- **React 19** - UI library for building component-based interfaces
- **TypeScript** - Type-safe JavaScript superset
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **Nodemailer** - For email functionality

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Create a `.env.local` file based on the `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Documentation

For comprehensive documentation about the project, please refer to the [documentation](./documentation) folder, which includes:

- [Project Overview](./documentation/project-overview.md)
- [Architecture](./documentation/architecture.md)
- [Setup Guide](./documentation/setup-guide.md)
- [Component Documentation](./documentation/components.md)
- [API Reference](./documentation/api-reference.md)

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Deployment

The easiest way to deploy the application is to use the [Vercel Platform](https://vercel.com) from the creators of Next.js.

For more information on deployment options, see the [Setup Guide](./documentation/setup-guide.md#deployment).

## License

This project is private and intended for internal use only.
