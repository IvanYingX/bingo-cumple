import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const { username } = params;
  const user = await prisma.user.findUnique({ 
    where: { username }, 
    select: {
      username: true,
      name: true,
      role: true,
    },
  });
  return NextResponse.json(user);
}