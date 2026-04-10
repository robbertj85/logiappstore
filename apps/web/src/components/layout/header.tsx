"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, ShoppingBag, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { label: "Producten", href: "/products" },
  { label: "Categorieën", href: "/categories" },
  { label: "Leveranciers", href: "/suppliers" },
  { label: "Over het platform", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  const dashboardHref = user?.role === "ADMIN" ? "/admin" : user?.role === "SUPPLIER" ? "/supplier" : "/dashboard";

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

            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden sm:flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-xs font-bold text-accent">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-semibold leading-tight">{user.name}</div>
                    <div className="text-[10px] text-white/50 leading-tight">
                      {user.role === "ADMIN" ? "Beheerder" : user.role === "SUPPLIER" ? "Leverancier" : "Vervoerder"}
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-white/50" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-border z-50 py-1">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-primary">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.organization}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent-dark">
                          {user.role === "ADMIN" ? "Beheerder" : user.role === "SUPPLIER" ? "Leverancier" : "Vervoerder"}
                        </span>
                      </div>
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary hover:bg-background transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-background transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Uitloggen
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-md font-semibold transition-colors"
              >
                <User className="h-4 w-4" />
                Inloggen
              </Link>
            )}

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

            {isLoggedIn && user ? (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 py-1">
                  <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-xs font-bold text-accent">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-white/50">{user.organization}</div>
                  </div>
                </div>
                <Link
                  href={dashboardHref}
                  className="block py-2 text-sm font-medium text-white/80 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-sm font-medium text-red-400 hover:text-red-300"
                >
                  Uitloggen
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </header>
  );
}
