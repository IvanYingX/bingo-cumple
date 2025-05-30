import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const StartGameModal = ({
  setShowDialog,
  loading,
  handleStartGame,
}: {
  setShowDialog: (show: boolean) => void;
  loading: boolean;
  handleStartGame: () => void;
}) => {
  return (
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
  );
};

export default StartGameModal;