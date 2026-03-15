import crypto from 'node:crypto';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

function canUseDemoAuth() {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  return process.env.ALLOW_DEMO_AUTH === 'true';
}

function isValidDemoCredentials(email?: string, password?: string) {
  const demoEmail = process.env.DEMO_LOGIN_EMAIL;
  const demoPassword = process.env.DEMO_LOGIN_PASSWORD;

  if (!demoEmail || !demoPassword || !email || !password) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const expectedEmail = demoEmail.trim().toLowerCase();

  const emailBuffer = Buffer.from(normalizedEmail);
  const expectedEmailBuffer = Buffer.from(expectedEmail);
  const passwordBuffer = Buffer.from(password);
  const expectedPasswordBuffer = Buffer.from(demoPassword);

  if (emailBuffer.length !== expectedEmailBuffer.length || passwordBuffer.length !== expectedPasswordBuffer.length) {
    return false;
  }

  const emailMatches = crypto.timingSafeEqual(emailBuffer, expectedEmailBuffer);
  const passwordMatches = crypto.timingSafeEqual(passwordBuffer, expectedPasswordBuffer);

  return emailMatches && passwordMatches;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Demo Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: { email?: string; password?: string } | undefined) {
        if (!canUseDemoAuth()) {
          return null;
        }

        if (!isValidDemoCredentials(credentials?.email, credentials?.password)) {
          return null;
        }

        const email = credentials?.email?.trim().toLowerCase();

        if (!email) {
          return null;
        }

        return {
          id: 'demo-user',
          email,
          name: email.split('@')[0]
        };
      }
    })
  ],
  pages: { signIn: '/dashboard' },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
};
