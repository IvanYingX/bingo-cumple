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
      <p className="text-lg">Recuerda las reglas del juego:</p>
      <ul className="list-disc pl-6">
        <li>Los jugadores deben marcar los eventos en sus cartones a medida que un evento ocurre.</li>
        <li>Los cartones se generan aleatoriamente y tienen 16 eventos únicos cada uno.</li>
        <li>Los eventos NO pueden ser forzados, deben ocurrir naturalmente durante el juego.</li>
        <li>Por ejemplo, si un evento dice &quot;Se habla de futbol&quot;, hablar uno mismo de futbol no cuenta. Asimismo, no se puede forzar una conversación sobre futbol para que cuente como un evento.</li>
        <li>Salir de un juego no afecta al progreso del jugador.</li>
        <li>El juego se puede reiniciar las veces que se quiera.</li>
      </ul>
      <AvailableGames />
    </div>
  );
}