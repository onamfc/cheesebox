import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { acceptPendingInvitations } from "./team-invitations";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }

        // Check if user exists with this Google ID
        const existingUser = await prisma.user.findFirst({
          where: {
            provider: "GOOGLE",
            providerId: account.providerAccountId,
          },
        });

        if (existingUser) {
          // Update user info from Google profile
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: user.name,
              image: user.image,
            },
          });
          return true;
        }

        // Check if user exists with this email (for account linking)
        const existingEmailUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingEmailUser) {
          // Link Google account to existing user
          await prisma.user.update({
            where: { id: existingEmailUser.id },
            data: {
              provider: "GOOGLE",
              providerId: account.providerAccountId,
              name: user.name || existingEmailUser.name,
              image: user.image || existingEmailUser.image,
            },
          });
          return true;
        }

        // Create new user with Google
        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            provider: "GOOGLE",
            providerId: account.providerAccountId,
          },
        });

        // Accept any pending team invitations
        await acceptPendingInvitations(newUser.id, newUser.email);

        return true;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }

      // For OAuth providers, fetch the user from database to get the correct ID
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findFirst({
          where: {
            provider: "GOOGLE",
            email: token.email as string,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = (token.name as string | null) || null;
        session.user.image = (token.image as string | null) || null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
