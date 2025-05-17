import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const now = new Date();
  const games = await prisma.game.findMany({ 
    include: {
      questions: true,
    },
    where: {
      availableAt: {
        lte: now,
      },
    },
  });
  return NextResponse.json(games);
}


export async function POST(req: Request) {
  const body = await req.json();
  const { name, questions } = body;

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Game name is required' }, { status: 400 });
  }

  const game = await prisma.game.create({
    data: {
      id: crypto.randomUUID(),
      name,
      questions: {
        create: questions.map((q: { question: string }) => ({
          id: crypto.randomUUID(),
          question: q.question,
        })),
      },
    },
    include: {
      questions: true,
    },
  });

  return NextResponse.json(game);
}