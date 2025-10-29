"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth";

export default function Nav() {
  const { user, loading } = useAuth();

  if (loading) return null;
  const linkClass =
    "text-inherit hover:underline active:scale-105 transition underline-offset-4";

  return (
      <nav className="container mx-auto flex flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/properties" className={linkClass}>
          Utforska boenden
        </Link>
        {user ? (
          <>
            <Link href="/properties/mine" className={linkClass}>
              Mina properties
            </Link>
            <Link href="/bookings" className={linkClass}>
              Mina bokningar
            </Link>
            <Link href="/auth/logout" className={linkClass}>
              Logga ut
            </Link>
          </>
        ) : (
          <>
            <Link href="/auth/login" className={linkClass}>
              Logga in
            </Link>
            <Link href="/auth/register" className={linkClass}>
              Skapa konto
            </Link>
          </>
        )}
      </nav>
  );
}
