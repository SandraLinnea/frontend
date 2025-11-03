"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth";
import { apiSend } from "@/utils/fetch";

function LogoutInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { refresh } = useAuth();
  const [msg, setMsg] = useState("Loggar ut…");

  useEffect(() => {
    (async () => {
      try {
        await apiSend("/auth/logout", "POST");
      } catch {
        setMsg("Utloggning misslyckades");
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
