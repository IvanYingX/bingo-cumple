import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ started: false });
  }

  const existing = await prisma.userQuestion.findFirst({
    where: {
      userId: userId,
      gameId: params.id,
    },
  });

  return NextResponse.json({ started: Boolean(existing) });
}
