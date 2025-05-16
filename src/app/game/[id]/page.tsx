import BingoBoard from '@/components/BingoBoard';

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Tu cartón</h1>
      <BingoBoard gameId={id} />
    </div>
  );
}
