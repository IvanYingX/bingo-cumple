import { auth } from "@/auth";
import AvailableGames from "../AvailableGames";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect('/signin');
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-2xl font-bold">Bienvenid@ {session.user.name}</p>
      <AvailableGames />
    </div>
  );
}