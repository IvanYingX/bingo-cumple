import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    console.log('Fetching game with ID:', params.id);
    const game = await prisma.game.findUnique({
      where: {
        id: params.id,
      },
      include: {
        questions: true,
      },
    });
    
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

export async function DELETE(_: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await prisma.game.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}
