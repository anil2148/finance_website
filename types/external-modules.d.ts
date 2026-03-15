declare module 'next-auth' {
  const NextAuth: any;
  export type NextAuthOptions = any;
  export default NextAuth;
}

declare module 'next-auth/providers/credentials' {
  const CredentialsProvider: any;
  export default CredentialsProvider;
}

declare module '@prisma/client' {
  export class PrismaClient {
    newsletterSubscriber: {
      upsert: (args: any) => Promise<any>;
    };
    constructor(args?: any);
  }
}
