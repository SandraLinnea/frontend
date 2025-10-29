import Image from "next/image";

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
}