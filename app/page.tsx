/* import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-6">
      <Image src="/EastBNBLogo.png" alt="EastBNB" width={200} height={40} priority />
      <p>Välkommen till EastBNB!</p>
      <div className="space-x-4">
        <a href="/properties">Utforska boenden</a>
        <a href="/auth/login">Logga in</a>
        <a href="/auth/register">Skapa konto</a>
      </div>
    </div>
  );
} */

  // app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/auth";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="space-y-6">
      {/* Ta bort denna Image om du redan visar loggan i layoutens header */}
      <Image src="/EastBNBLogo.png" alt="EastBNB" width={200} height={40} priority />

      <p>Välkommen till EastBNB!</p>

      {!loading && (
        <div className="space-x-4">
          <Link href="/properties">Utforska boenden</Link>

          {user ? (
            <>
              <Link href="/properties/mine">Mina properties</Link>
              <Link href="/bookings">Mina bokningar</Link>
              {/* Logga ut ligger redan i Nav – kan tas bort här om du vill */}
            </>
          ) : (
            <>
              <Link href="/auth/login">Logga in</Link>
              <Link href="/auth/register">Skapa konto</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
