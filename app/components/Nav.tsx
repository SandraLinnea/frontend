"use client";
import Link from "next/link";
import { useAuth } from "@/context/auth";

export default function Nav() {
  const { user, loading } = useAuth();

  return (
    <nav className="flex gap-6 mt-4">
      <Link href="/properties">Utforska boenden</Link>

      {loading ? null : user ? (
        <>
          <Link href="/properties/new">Lägg upp boende</Link>
          <Link href="/auth/logout">Logga ut</Link>
        </>
      ) : (
        <>
          <Link href="/auth/login">Logga in</Link>
          <Link href="/auth/register">Skapa konto</Link>
        </>
      )}
    </nav>
  );
}
