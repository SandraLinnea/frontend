"use client";
import Link from "next/link";
import { useAuth } from "@/context/auth";

export default function Nav() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <nav className="flex flex-wrap items-center gap-4">
      <Link href="/properties">Utforska boenden</Link>
      {user ? (
        <>
          <Link href="/properties/mine">Mina properties</Link>
          <Link href="/bookings">Mina bokningar</Link>
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
