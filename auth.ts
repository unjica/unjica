import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
    newUser: "/register",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          // @ts-ignore - Prisma typing issue
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // If user not found or password doesn't exist
          if (!user || !user.password || typeof user.password !== 'string') {
            return null;
          }

          // Check password - using type assertion to help TypeScript
          const passwordValid = await compare(
            credentials.password as string,
            user.password as string
          );

          if (!passwordValid) {
            return null;
          }

          // Return user without password
          return {
            id: user.id,
            name: user.name || '',
            email: user.email,
            role: user.role || 'USER',
            image: user.image,
          };
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to token during sign-in
      if (user) {
        // @ts-ignore - type safety handled with defaults
        token.id = user.id;
        // @ts-ignore - type safety handled with defaults
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session from token
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
  },
}); 