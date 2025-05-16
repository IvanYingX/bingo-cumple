'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Game, GameQuestion } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
interface GameWithQuestions extends Game {
  questions: GameQuestion[];
}

interface CardGameProps {
  game: GameWithQuestions;
}

const CardGame = ({ game }: CardGameProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCardClick = async () => {
    if (!session?.user?.id) return;

    setLoading(true);

    const res = await fetch(`/api/games/${game.id}/status`);
    const { started } = await res.json();

    setLoading(false);

    if (started) {
      router.push(`/game/${game.id}`);
    } else {
      setShowDialog(true);
    }
  };

  const handleStartGame = async () => {
    setLoading(true);

    await fetch(`/api/games/${game.id}/start`, {
      method: 'POST',
    });

    setLoading(false);
    setShowDialog(false);
    router.push(`/game/${game.id}`);
  };

  return (
    <>
      <Card className="w-full cursor-pointer" onClick={handleCardClick}>
        <CardHeader>
          <CardTitle>{game.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Número de eventos: {game.questions.length}</p>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Empezar este juego?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleStartGame} disabled={loading}>
              Comenzar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CardGame;
