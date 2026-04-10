import Link from "next/link";
import {
  ShieldCheck, Users, Wallet, BarChart3, ArrowRight,
  Building2, Scale, Truck, Package,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over het platform — Logistiek Digistore",
  description: "De Logistiek Digistore is een initiatief van Connekt, TLN, VERN en evofenedex voor digitalisering van de transportsector.",
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              Over de Logistiek Digistore
            </h1>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              Het centrale platform waar transportbedrijven digitale oplossingen
              vinden en financieren met hun Terugsluis-budget.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* What is it */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Wat is de Logistiek Digistore?</h2>
          <div className="prose max-w-none text-muted-foreground">
            <p>
              De Logistiek Digistore is een online marktplaats waar IT-leveranciers hun
              producten en diensten aanbieden aan kleine en middelgrote transportbedrijven
              in Nederland. Het platform is ontwikkeld om de digitale transformatie in de
              transportsector te versnellen.
            </p>
            <p className="mt-3">
              Transportbedrijven kunnen hun producten zoeken, vergelijken en aanschaffen
              met budget uit het <strong>Truck Toll Terugsluis-programma</strong> — de
              terugsluizing van tolheffingsinkomsten naar de sector voor verduurzaming
              en innovatie.
            </p>
          </div>
        </section>

        {/* Terugsluis */}
        <section className="bg-white border border-border rounded-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
              <Wallet className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Het Terugsluis-programma</h2>
              <p className="text-sm text-muted-foreground mt-1">
                De Nederlandse overheid heft tol op vrachtverkeer. Een deel van deze
                inkomsten wordt teruggesluisd naar de transportsector via het
                Terugsluis-programma. Transportbedrijven ontvangen budget dat zij
                kunnen besteden aan digitalisering, verduurzaming en innovatie.
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                Via de Logistiek Digistore kunt u dit budget besteden aan goedgekeurde
                IT-oplossingen. Producten met het label{" "}
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold">
                  <ShieldCheck className="h-3 w-3" />
                  Terugsluis Geschikt
                </span>{" "}
                komen in aanmerking.
              </p>
            </div>
          </div>
        </section>

        {/* Governance */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">Beheer & governance</h2>
          <p className="text-muted-foreground mb-6">
            De Logistiek Digistore wordt gezamenlijk beheerd door vier organisaties
            die de belangen van de transportsector vertegenwoordigen:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Connekt",
                role: "Platformeigenaar & Terugsluis-administratie",
                icon: Building2,
              },
              {
                name: "TLN",
                role: "Categorie-taxonomie & sector-expertise",
                icon: Truck,
              },
              {
                name: "VERN",
                role: "Vertegenwoordiging eigen rijders",
                icon: Users,
              },
              {
                name: "evofenedex",
                role: "Verladers- & logistiekperspectief",
                icon: Package,
              },
            ].map((org) => (
              <div key={org.name} className="card p-5">
                <div className="w-10 h-10 bg-highlight/10 rounded-lg flex items-center justify-center mb-3">
                  <org.icon className="h-5 w-5 text-highlight" />
                </div>
                <h3 className="text-base font-bold text-primary">{org.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{org.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mijn Digitale Landschap */}
        <section className="bg-white border border-border rounded-xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-highlight/10 rounded-lg flex items-center justify-center shrink-0">
              <BarChart3 className="h-6 w-6 text-highlight" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Mijn Digitale Landschap</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Alle producten in de Logistiek Digistore zijn gecategoriseerd volgens
                het <strong>Mijn Digitale Landschap</strong> framework van TLN. Dit
                framework beschrijft het complete IT-landschap van een transportbedrijf
                — van TMS en fleet management tot boekhouding en cybersecurity.
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center gap-1 text-sm font-semibold text-highlight hover:underline mt-3"
              >
                Bekijk alle categorieën
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">Kwaliteit & vertrouwen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card p-5">
              <ShieldCheck className="h-6 w-6 text-accent mb-3" />
              <h3 className="text-sm font-bold text-primary">KvK-geverifieerd</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Alle leveranciers worden geverifieerd via het Handelsregister van de
                Kamer van Koophandel.
              </p>
            </div>
            <div className="card p-5">
              <Scale className="h-6 w-6 text-highlight mb-3" />
              <h3 className="text-sm font-bold text-primary">Inhoudelijke controle</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Productlistings worden gecontroleerd op kwaliteit, volledigheid
                en juistheid van informatie.
              </p>
            </div>
            <div className="card p-5">
              <Users className="h-6 w-6 text-warning mb-3" />
              <h3 className="text-sm font-bold text-primary">Echte beoordelingen</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Alleen geverifieerde kopers kunnen beoordelingen plaatsen.
                Leveranciers kunnen reageren.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Privacy & voorwaarden</h2>
          <div className="prose max-w-none text-muted-foreground text-sm space-y-3">
            <p>
              De Logistiek Digistore verwerkt persoonsgegevens conform de Algemene
              Verordening Gegevensbescherming (AVG). Wij verzamelen alleen gegevens
              die noodzakelijk zijn voor het functioneren van het platform.
            </p>
            <p>
              Voor vragen over privacy kunt u contact opnemen via{" "}
              <span className="text-highlight">privacy@logistiekappstore.nl</span>.
            </p>
            <p>
              Door gebruik te maken van de Logistiek Digistore gaat u akkoord met onze
              algemene voorwaarden en ons privacybeleid.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary to-primary-light rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Klaar om te beginnen?</h2>
          <p className="text-white/70 mt-2 max-w-md mx-auto">
            Ontdek IT-oplossingen voor uw transportbedrijf of registreer als leverancier.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/products" className="btn-primary inline-flex items-center justify-center gap-2">
              Bekijk producten
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md transition-colors"
            >
              Registreer als leverancier
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
