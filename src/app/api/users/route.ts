import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await prisma.user.findMany({ 
    select: {
      username: true,
      name: true,
      role: true,
    },
  });
  return NextResponse.json(user);
}