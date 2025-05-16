import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function PATCH(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uq = await prisma.userQuestion.findUnique({
    where: { id: params.id },
  });

  if (!uq || uq.userId !== userId) {
    return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 });
  }

  const updated = await prisma.userQuestion.update({
    where: { id: params.id },
    data: {
      selected: !uq.selected,
    },
  });

  return NextResponse.json({ success: true, selected: updated.selected });
}
