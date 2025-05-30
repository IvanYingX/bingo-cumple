import CreateGameForm from "@/components/CreateGameForm";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-4">
      <CreateGameForm gameId={id} />
    </div>
  );
}
