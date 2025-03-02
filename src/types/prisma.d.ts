import { PrismaClient } from '@prisma/client'

declare global {
  namespace PrismaJson {
    // Add any JSON fields here if needed
  }
}

// Fix for missing field definitions
declare module '@prisma/client' {
  export interface GeneratedArticle {
    slug?: string | null
  }
  
  export interface GeneratedArticleWhereInput {
    slug?: string | null | { not: null | string } | {}
  }
  
  export interface GeneratedArticleSelect<T = unknown> {
    slug?: boolean
  }
  
  export interface GeneratedArticleUpdateInput {
    slug?: string | null
  }
  
  export interface GeneratedArticleUncheckedUpdateInput {
    slug?: string | null
  }
}

export {} 