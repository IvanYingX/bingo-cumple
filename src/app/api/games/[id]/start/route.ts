import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const game = await prisma.game.findUnique({
    where: { id: params.id },
    include: { questions: true },
  });

  if (!game || game.questions.length < 16) {
    return NextResponse.json({ error: 'Not enough questions' }, { status: 400 });
  }

  // Shuffle and pick 16
  const selected = [...game.questions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 16);

  await prisma.$transaction(
    selected.map((q, idx) =>
      prisma.userQuestion.create({
        data: {
          id: crypto.randomUUID(),
          userId,
          gameId: game.id,
          questionId: q.id,
          idx,
        },
      })
    )
  );

  return NextResponse.json({ success: true });
}
