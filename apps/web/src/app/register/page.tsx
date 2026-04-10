"use client";

import Link from "next/link";
import { Truck, Code, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="bg-background min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Registreren
          </h1>
          <p className="text-muted-foreground mt-2">
            Maak een account aan op de Logistiek Digistore
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-warning/10 text-amber-700 px-4 py-2 rounded-full text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            Demo-modus — registratie is gesimuleerd
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Consumer registration */}
          <Link href="/login" className="group">
            <div className="card p-6 h-full flex flex-col hover:border-accent/50 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Truck className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">
                Vervoerder
              </h2>
              <p className="text-sm text-muted-foreground mt-2 flex-1">
                Registreer uw transportbedrijf, blader door producten en besteed
                uw Terugsluis-budget aan IT-oplossingen.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent shrink-0" />
                  KvK-nummer & kenteken verificatie
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent shrink-0" />
                  RDW-validatie van voertuigen
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent shrink-0" />
                  Terugsluis-budget beheer
                </li>
              </ul>
              <div className="mt-6 btn-primary text-center flex items-center justify-center gap-2">
                Registreer als vervoerder
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Supplier registration */}
          <Link href="/login" className="group">
            <div className="card p-6 h-full flex flex-col hover:border-highlight/50 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-lg bg-highlight/10 text-highlight flex items-center justify-center mb-4 group-hover:bg-highlight/20 transition-colors">
                <Code className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-primary group-hover:text-highlight transition-colors">
                Leverancier
              </h2>
              <p className="text-sm text-muted-foreground mt-2 flex-1">
                Bied uw IT-producten en diensten aan op de Logistiek Digistore
                en bereik duizenden transportbedrijven.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-highlight shrink-0" />
                  KvK-verificatie & bedrijfsprofiel
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-highlight shrink-0" />
                  Goedkeuring door Logistiek Digitaal
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-highlight shrink-0" />
                  Producten listen & analytics
                </li>
              </ul>
              <div className="mt-6 bg-highlight hover:bg-highlight/90 text-white font-semibold px-6 py-3 rounded-md text-center flex items-center justify-center gap-2 transition-colors">
                Registreer als leverancier
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Heeft u al een account?{" "}
          <Link href="/login" className="text-highlight font-semibold hover:underline">
            Inloggen
          </Link>
        </p>
      </div>
    </div>
  );
}
