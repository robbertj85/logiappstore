"use client";

import { useRouter } from "next/navigation";
import { Truck, Code, ShieldCheck, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { AuthRole } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, user } = useAuth();

  const handleLogin = (role: AuthRole) => {
    login(role);
    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "SUPPLIER_NEW") {
      router.push("/supplier/onboarding");
    } else if (role === "SUPPLIER") {
      router.push("/supplier");
    } else {
      router.push("/dashboard");
    }
  };

  if (isLoggedIn && user) {
    return (
      <div className="bg-background min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white border border-border rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-primary">U bent al ingelogd</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Ingelogd als <strong>{user.name}</strong> ({user.organization})
          </p>
          <button
            onClick={() => router.push(user.role === "ADMIN" ? "/admin" : user.role === "SUPPLIER" ? "/supplier" : "/dashboard")}
            className="btn-primary mt-6 inline-flex items-center gap-2"
          >
            Ga naar dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Inloggen op de Logistiek Digistore
          </h1>
          <p className="text-muted-foreground mt-2">
            Kies uw rol om in te loggen met een demo-account
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-warning/10 text-amber-700 px-4 py-2 rounded-full text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            Demo-modus — geen echt wachtwoord nodig
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Consumer card */}
          <button
            onClick={() => handleLogin("CONSUMER")}
            className="group text-left"
          >
            <div className="card p-6 h-full flex flex-col hover:border-accent/50 hover:shadow-md transition-all cursor-pointer">
              <div className="w-14 h-14 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Truck className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">
                Vervoerder
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Transport company / Consumer
              </p>
              <p className="text-sm text-muted-foreground mt-3 flex-1">
                Log in als MKB-transportbedrijf. Blader door producten,
                beheer uw Terugsluis-budget, schrijf beoordelingen en doe aankopen.
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-primary">Jan de Vries</strong>
                </p>
                <p className="text-xs text-muted-foreground">De Vries Transport BV</p>
                <p className="text-xs text-muted-foreground">jan@devriesbv.nl</p>
              </div>
              <div className="mt-4 btn-primary text-center flex items-center justify-center gap-2 group-hover:bg-accent-dark">
                Inloggen als vervoerder
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </button>

          {/* Approved supplier card */}
          <button
            onClick={() => handleLogin("SUPPLIER")}
            className="group text-left"
          >
            <div className="card p-6 h-full flex flex-col hover:border-highlight/50 hover:shadow-md transition-all cursor-pointer">
              <div className="w-14 h-14 rounded-lg bg-highlight/10 text-highlight flex items-center justify-center mb-4 group-hover:bg-highlight/20 transition-colors">
                <Code className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-primary group-hover:text-highlight transition-colors">
                Leverancier
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Goedgekeurde leverancier
              </p>
              <p className="text-sm text-muted-foreground mt-3 flex-1">
                Log in als goedgekeurde IT-leverancier. Beheer productlistings,
                bekijk analytics en reageer op beoordelingen.
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-primary">Lisa van Dijk</strong>
                </p>
                <p className="text-xs text-muted-foreground">Transtics</p>
                <p className="text-xs text-muted-foreground">lisa@transtics.nl</p>
              </div>
              <div className="mt-4 bg-highlight hover:bg-highlight/90 text-white font-semibold px-6 py-3 rounded-md text-center flex items-center justify-center gap-2 transition-colors">
                Inloggen als leverancier
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </button>

          {/* Admin / Connekt card */}
          <button
            onClick={() => handleLogin("ADMIN")}
            className="group text-left"
          >
            <div className="card p-6 h-full flex flex-col hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
              <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-primary group-hover:text-primary/80 transition-colors">
                Beheerder
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connekt / Logistiek Digitaal
              </p>
              <p className="text-sm text-muted-foreground mt-3 flex-1">
                Log in als systeembeheerder. Bekijk alle facturen,
                beheer uitbetalingen en monitor het Terugsluis-programma.
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-primary">Sophie van der Berg</strong>
                </p>
                <p className="text-xs text-muted-foreground">Connekt / Logistiek Digitaal</p>
                <p className="text-xs text-muted-foreground">sophie@connekt.nl</p>
              </div>
              <div className="mt-4 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-md text-center flex items-center justify-center gap-2 transition-colors">
                Inloggen als beheerder
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </button>
        </div>

        {/* Nieuwe leverancier — separate section */}
        <div className="mt-10 pt-8 border-t border-border">
          <div className="card p-6 flex flex-col sm:flex-row items-center gap-6 border-dashed hover:border-amber-400/50 hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg font-bold text-primary">Nieuwe leverancier?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Ervaar het onboarding-proces voor nieuwe leveranciers, inclusief goedkeuring door Connekt / Logistiek Digitaal.
                Demo-account: <strong className="text-primary">Mark Jansen</strong> (LogiSoftware BV)
              </p>
            </div>
            <button
              onClick={() => handleLogin("SUPPLIER_NEW")}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-md flex items-center gap-2 transition-colors shrink-0"
            >
              Start onboarding
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
