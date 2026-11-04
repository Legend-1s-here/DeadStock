import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      businessName?: string | null;
      businessType?: string | null;
      city?: string | null;
      verified?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    businessName?: string | null;
    businessType?: string | null;
    city?: string | null;
    verified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    businessName?: string | null;
    businessType?: string | null;
    city?: string | null;
    verified?: boolean;
  }
}
