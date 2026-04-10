import { NextRequest, NextResponse } from "next/server";

const RDW_BASE_URL = "https://opendata.rdw.nl/resource/m9d7-ebf2.json";

function normalizeKenteken(kenteken: string): string {
  return kenteken.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

export async function GET(request: NextRequest) {
  const kenteken = request.nextUrl.searchParams.get("kenteken");

  if (!kenteken) {
    return NextResponse.json(
      { error: "Kenteken is verplicht" },
      { status: 400 }
    );
  }

  const normalized = normalizeKenteken(kenteken);

  if (normalized.length < 4 || normalized.length > 8) {
    return NextResponse.json(
      { error: "Ongeldig kenteken formaat" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${RDW_BASE_URL}?kenteken=${normalized}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "RDW API niet beschikbaar" },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Kenteken niet gevonden" },
        { status: 404 }
      );
    }

    const vehicle = data[0];

    return NextResponse.json({
      kenteken: vehicle.kenteken,
      merk: vehicle.merk || "Onbekend",
      handelsbenaming: vehicle.handelsbenaming || "Onbekend",
      voertuigsoort: vehicle.voertuigsoort || "Onbekend",
      eerste_kleur: vehicle.eerste_kleur || "Onbekend",
      toegestane_maximum_massa_voertuig:
        Number(vehicle.toegestane_maximum_massa_voertuig) || 0,
      datum_eerste_toelating: vehicle.datum_eerste_toelating || "",
      vervaldatum_apk: vehicle.vervaldatum_apk || "",
      wam_verzekerd: vehicle.wam_verzekerd || "Nee",
    });
  } catch {
    return NextResponse.json(
      { error: "Kon geen verbinding maken met RDW" },
      { status: 502 }
    );
  }
}
