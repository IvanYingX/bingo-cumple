import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteGameModal = ({
  gameId,
  setShowDeleteDialog,
  loading,
  handleDeleteGame,
}: {
  gameId: string;
  setShowDeleteDialog: (show: boolean) => void;
  loading: boolean;
  handleDeleteGame: (gameId: string) => void;
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>¿Estás segur@ de que deseas eliminar este juego?</DialogTitle>
      </DialogHeader>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
          Cancelar
        </Button>
        <Button onClick={() => handleDeleteGame(gameId)} disabled={loading}>
          Eliminar
        </Button>
      </div>
    </DialogContent>
  );
};

export default DeleteGameModal;