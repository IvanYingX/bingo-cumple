import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
