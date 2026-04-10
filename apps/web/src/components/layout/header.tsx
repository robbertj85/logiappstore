"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, ShoppingBag, User } from "lucide-react";

const navItems = [
  { label: "Producten", href: "/products" },
  { label: "Categorieën", href: "/categories" },
  { label: "Leveranciers", href: "/suppliers" },
  { label: "Over het platform", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-white sticky top-0 z-50">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <ShoppingBag className="h-7 w-7 text-accent" />
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight">Logistiek</span>
              <span className="text-xs text-accent font-semibold leading-tight -mt-0.5">
                Appstore
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Zoeken</span>
            </Link>
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-md font-semibold transition-colors"
            >
              <User className="h-4 w-4" />
              Inloggen
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-sm font-medium text-white/80 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <Link
                href="/products"
                className="flex-1 flex items-center justify-center gap-1.5 text-sm text-white border border-white/20 px-4 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                Zoeken
              </Link>
              <Link
                href="/login"
                className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-accent text-white px-4 py-2 rounded-md font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Inloggen
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
