/* "use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function LogoutPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { refresh } = useAuth();
  const [msg, setMsg] = useState("Loggar ut…");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error ?? "Utloggning misslyckades");
        }
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Utloggning misslyckades");
      } finally {
        await refresh();
        const back = search.get("redirect") ?? "/";
        router.replace(back);
      }
    })();
  }, [router, search, refresh]);

  return <p>{msg}</p>;
}
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth";

function LogoutInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { refresh } = useAuth();
  const [msg, setMsg] = useState("Loggar ut…");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error ?? "Utloggning misslyckades");
        }
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Utloggning misslyckades");
      } finally {
        await refresh();
        const back = search.get("redirect") ?? "/";
        router.replace(back);
      }
    })();
  }, [router, search, refresh]);

  return <p>{msg}</p>;
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<p>Loggar ut…</p>}>
      <LogoutInner />
    </Suspense>
  );
}
