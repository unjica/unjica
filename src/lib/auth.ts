/// <reference types="next-auth" />
/// <reference types="next-auth/jwt" />
import { compare, hash } from "bcryptjs";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { prisma } from "./db";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
    newUser: "/register",
  },
  providers: [
    Credentials({
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
          const user = await (prisma as any).user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              role: true,
              image: true,
            },
          });

          // If user not found or password doesn't match
          if (!user || !user.password) {
            return null;
          }

          // Check password - ensure password is a string
          const passwordValid = await compare(
            String(credentials.password),
            String(user.password)
          );
          
          if (!passwordValid) {
            return null;
          }

          // Return user without password
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
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
        token.id = user.id || "";
        token.role = user.role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session from token
      if (token && session.user) {
        // @ts-ignore - We know these values exist in practice
        session.user.id = token.id;
        // @ts-ignore - We know these values exist in practice
        session.user.role = token.role;
      }
      return session;
    },
  },
};

// Helper function to create a new user
export async function createUser(name: string, email: string, password: string) {
  try {
    // Check if user with this email already exists
    const existingUser = await (prisma as any).user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = await (prisma as any).user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Set as ADMIN if it's the admin email
        role: email === "sanja.malovic2@gmail.com" ? "ADMIN" : "USER",
      },
    });

    return { 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email, 
      role: newUser.role 
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Add role type to next-auth session
declare module "next-auth" {
  interface User {
    role?: "ADMIN" | "USER";
  }

  interface Session {
    user?: User & {
      id: string;
      role: "ADMIN" | "USER";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "USER";
  }
} 