'use client';

import CardGame from "./CardGame";
import { useGetGamesQuery } from "@/lib/features/gameSlice";

export default function AvailableGames() {
  const { data, isLoading} = useGetGamesQuery();
  if (isLoading) return <div>Cargando juegos...</div>;
  if (!data || data.length === 0) return <div>Parece que no hay juegos disponibles</div>;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-bold">
        Juegos disponibles
      </p>
      <div className="flex flex-row gap-4">
      {data?.map((game) => (
          <CardGame key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}