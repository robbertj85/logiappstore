import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-6 w-6 text-accent" />
              <div>
                <span className="text-lg font-bold">Logistiek Appstore</span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Het platform voor digitale oplossingen in de transport en logistiek sector.
              Gefinancierd via het Terugsluis-programma.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-accent">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-white/60 hover:text-white transition-colors">
                  Alle producten
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-white/60 hover:text-white transition-colors">
                  Categorieën
                </Link>
              </li>
              <li>
                <Link href="/suppliers" className="text-sm text-white/60 hover:text-white transition-colors">
                  Leveranciers
                </Link>
              </li>
            </ul>
          </div>

          {/* Organisaties */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-accent">Organisaties</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-white/60">Connekt</span></li>
              <li><span className="text-sm text-white/60">TLN</span></li>
              <li><span className="text-sm text-white/60">VERN</span></li>
              <li><span className="text-sm text-white/60">evofenedex</span></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-accent">Informatie</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">
                  Over het platform
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">
                  Terugsluis-programma
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">
                  Privacy beleid
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">
                  Algemene voorwaarden
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Logistiek Appstore — Een initiatief van Connekt, TLN, VERN en evofenedex
          </p>
        </div>
      </div>
    </footer>
  );
}
