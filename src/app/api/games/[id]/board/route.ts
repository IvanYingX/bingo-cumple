import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const board = await prisma.userQuestion.findMany({
    where: {
      userId,
      gameId: params.id,
    },
    orderBy: { idx: 'asc' },
    include: {
      question: true,
    },
  });


  const formatted = board.map((q) => ({
    id: q.id,
    question: q.question.question,
    selected: q.selected,
  }));

  return NextResponse.json(formatted);
}
