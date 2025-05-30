import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UpdateGameModal = ({
  gameId,
  setShowUpdateDialog,
  loading,
  handleUpdateGame,
}: {
  gameId: string;
  setShowUpdateDialog: (show: boolean) => void;
  loading: boolean;
  handleUpdateGame: (gameId: string) => void;
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>¿Estás segur@ de que deseas actualizar este juego? Si se cambia, todos los jugadores que hayan empezado el juego perderán su progreso.</DialogTitle>
      </DialogHeader>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
          Cancelar
        </Button>
        <Button onClick={() => handleUpdateGame(gameId)} disabled={loading}>
          Actualizar
        </Button>
      </div>
    </DialogContent>
  );
};

export default UpdateGameModal;