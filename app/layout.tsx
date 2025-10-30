import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { AuthProvider } from "@/context/auth";
import Nav from "@/components/Nav";

export const metadata = { title: "EastBNB" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        <AuthProvider>
          <header className="border-b bg-[#d7c7c5] text-black">
            <div className="mx-auto max-w-4xl flex items-center justify-between p-4">
              <Link href="/" aria-label="Gå till start">
                <Image
                  src="/EastBNBLogo.png"
                  alt="EastBNB"
                  width={542}
                  height={166}
                  priority
                />
              </Link>
              <Nav />
            </div>
          </header>
          <main className="mx-auto max-w-4xl p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
