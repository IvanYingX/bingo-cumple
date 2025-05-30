import SignOut from './SignOut';
import Link from 'next/link';
import { auth } from '@/auth';
import { Button } from '../ui/button';

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
          
        </div>
      </div>
      <div className="flex flex-row justify-end gap-4">
        {session.user.role === 'ADMIN' && ( 
          <Button className="font-bold cursor-pointer">
            <Link href="/create-game" className="text-white">
              Crear Juego
            </Link>
          </Button>
        )}
        <SignOut />
      </div>
    </header>
  );
}
