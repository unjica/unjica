import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    role?: 'ADMIN' | 'USER';
  }

  interface Session {
    user?: User & {
      id: string;
      role: 'ADMIN' | 'USER';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'USER';
  }
} 