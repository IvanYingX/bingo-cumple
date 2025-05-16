import Dashboard from "@/components/Dashboard";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect('/signin');
  }
  return (
    <SessionProvider session={session}>

      <Dashboard />
    </SessionProvider>
  );
}
