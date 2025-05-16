import CreateGameForm from "@/components/CreateGameForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CreateGamePage() {
  const session = await auth();
  if (!session) {
    redirect('/signin');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-2xl font-bold">Crear Juego</p>
      <CreateGameForm />
    </div>
  );
} 