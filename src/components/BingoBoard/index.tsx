'use client';

import { useGetBoardQuery, useToggleCellMutation } from '@/lib/features/gameSlice';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Props {
  gameId: string;
}

const BingoBoard = ({ gameId }: Props) => {
  const { data: questions, isLoading } = useGetBoardQuery(gameId);
  const [toggleCell] = useToggleCellMutation();

  const handleToggle = async (questionId: string) => {
    await toggleCell({ questionId, gameId });
  };

  if (isLoading || !questions) {
    return <p className="text-center text-muted-foreground py-6">Cargando tablero...</p>;
  }

  return (
    <div className="max-w-lg mx-auto grid grid-cols-4 gap-2">
      {questions.map((q) => (
        <Card
          key={q.id}
          onClick={() => handleToggle(q.id)}
          className={cn(
            'cursor-pointer flex items-center justify-center text-center text-sm border border-gray-300 transition p-2 aspect-square min-h-[100px] whitespace-normal break-words',
            q.selected ? 'bg-teal-600 text-white' : 'bg-white hover:bg-gray-100'
          )}
        >
          {q.question}
        </Card>
      
      ))}
    </div>
  );
};

export default BingoBoard;
