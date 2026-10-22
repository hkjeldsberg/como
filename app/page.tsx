"use client";

import { Game } from "@/components/game";
import { Login } from "@/components/login";
import { playerFromEmail, useSession } from "@/hooks/use-game";

export default function Home() {
  const { session, loading } = useSession();

  if (loading) return null;
  if (!session || !playerFromEmail(session.user.email)) return <Login />;
  return <Game key={session.user.id} session={session} />;
}
