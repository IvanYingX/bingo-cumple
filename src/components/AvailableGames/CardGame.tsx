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
import { Dialog } from '@/components/ui/dialog';
import { useGetGameStatusQuery, useStartGameMutation, useDeleteGameMutation } from '@/lib/features/gameSlice';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import StartGameModal from './StartGameModal';
import DeleteGameModal from './DeleteGameModal';
import UpdateGameModal from './UpdateGameModal';

interface GameWithQuestions extends Game {
  questions: GameQuestion[];
}

interface CardGameProps {
  game: GameWithQuestions;
  refetchGames: () => void;
}

const CardGame = ({ game, refetchGames }: CardGameProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: gameStatus, isLoading } = useGetGameStatusQuery({ gameId: game.id });
  const [startGame] = useStartGameMutation();
  const [deleteGame] = useDeleteGameMutation();

  const handleCardClick = async () => {
    if (!session?.user?.id) return;

    setLoading(true);

    if (gameStatus?.started) {
      router.push(`/game/${game.id}`);
      setLoading(false);
      return;
    }
    setShowDialog(true);
    setLoading(false);
  };

  const handleDeleteGame = async (gameId: string) => {
    setLoading(true);
    try {
      await deleteGame(gameId).unwrap();
      toast.success('Juego eliminado correctamente');
      refetchGames();
    } catch (error) {
      console.error('Ha ocurrido un error al eliminar el juego:', error);
      toast.error('Error al eliminar el juego');
    } finally {
      setShowDeleteDialog(false);
      setLoading(false);
    }
  };

  const handleUpdateGame = () => {
    router.push(`/edit-game/${game.id}`);
    setShowUpdateDialog(false);
  };

  const handleStartGame = async () => {
    setLoading(true);

    await startGame(game.id).unwrap().catch((error) => {
      console.error('Error starting game:', error);
      setLoading(false);
      return;
    });

    setLoading(false);
    setShowDialog(false);
    router.push(`/game/${game.id}`);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{game.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Número de eventos: {game.questions.length}</p>
        </CardContent>
        <div className="flex flex-row justify-end">
          <Button
            className="w-[30%] mx-4 p-2 cursor-pointer"
            onClick={handleCardClick}
            disabled={isLoading || loading}
          >
            {gameStatus?.started ? 'Continuar juego' : 'Iniciar juego'}
          </Button>
          {session?.user?.role === 'ADMIN' && (
            <>
              <Button
                className="w-[30%] mx-4 p-2 cursor-pointer"
                onClick={() => setShowUpdateDialog(true)}
                disabled={loading}
              >
                Administrar juego 
              </Button>
              <Button
                className="mx-4 p-2 cursor-pointer"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={loading}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <StartGameModal
          gameId={game.id}
          setShowDialog={setShowDialog}
          loading={loading}
          handleStartGame={handleStartGame}
        />
      </Dialog>
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <UpdateGameModal
          gameId={game.id}
          setShowUpdateDialog={setShowUpdateDialog}
          loading={loading}
          handleUpdateGame={handleUpdateGame}
        />
      </Dialog>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DeleteGameModal
          gameId={game.id}
          setShowDeleteDialog={setShowDeleteDialog}
          loading={loading}
          handleDeleteGame={handleDeleteGame}
        />
      </Dialog>
    </>
  );
};

export default CardGame;
