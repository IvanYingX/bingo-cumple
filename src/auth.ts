import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { Role } from "@prisma/client";
const nextAuth = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;
      
        if (typeof username !== "string" || typeof password !== "string") {
          return null;
        }
      
        const existingUser = await prisma.user.findUnique({
          where: { username },
        });
        if (existingUser) {
          const isValid = await compare(password, existingUser.password);
          if (isValid) {
            return { id: existingUser.username, name: existingUser.username, role: existingUser.role, email: existingUser.username };
          } else {
            return null;
          }
        } else {
          const hashedPassword = await hash(password, 10);
          const newUser = await prisma.user.create({
            data: {
              username,
              password: hashedPassword,
              role: Role.USER,
            },
          });
          return { id: newUser.username, name: newUser.username, role: newUser.role, email: newUser.username };
        }
      }
      
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.role = token.role as Role;
      session.user.email = token.email as string;
      return session;
    },
  },
});

export const { handlers, signIn, signOut, auth } = nextAuth;