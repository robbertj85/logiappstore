import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Logistiek Digistore — Digitale oplossingen voor transport",
  description:
    "Het platform voor IT-oplossingen in de transport en logistiek sector. Vind en vergelijk software met uw Terugsluis-budget.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <div className="fixed bottom-4 left-4 z-50 bg-amber-500 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg pointer-events-none select-none opacity-90">
            Demo
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
