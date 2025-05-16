import SignOut from './SignOut';
import Link from 'next/link';
import { auth } from '@/auth';

export default async function NavBar() {
  const session = await auth();
  if (!session) return null;
  return (
    <header className="flex h-14 items-center justify-end gap-4 border-b bg-gray-200 px-4 lg:h-[60px] lg:px-6">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row gap-8 items-center">
          <Link href="/" className="text-2xl font-bold">
            Bingo
          </Link>
          {session.user.role === 'ADMIN' && ( 
            <Link href="/create-game" className="text-xl font-bold">
              Crear Juego
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-row justify-end gap-4">
        <SignOut />
      </div>
    </header>
  );
}
