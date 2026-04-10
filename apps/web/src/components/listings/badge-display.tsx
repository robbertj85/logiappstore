import { ShieldCheck, Award, Wallet, TrendingUp, Star } from "lucide-react";
import type { Listing, Organization } from "@logiappstore/shared";

interface BadgeDisplayProps {
  listing: Listing;
  organization?: Organization;
  size?: "sm" | "md";
}

export function BadgeDisplay({ listing, organization, size = "sm" }: BadgeDisplayProps) {
  const badges: { label: string; className: string; icon: React.ReactNode }[] = [];

  if (organization?.kvkVerified) {
    badges.push({
      label: "Geverifieerd",
      className: "bg-accent/10 text-accent-dark",
      icon: <ShieldCheck className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />,
    });
  }

  if (organization?.trustedPartner) {
    badges.push({
      label: "Vertrouwde Partner",
      className: "bg-primary/10 text-primary",
      icon: <Award className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />,
    });
  }

  if (listing.terugsluisEligible) {
    badges.push({
      label: "Terugsluis",
      className: "bg-primary/10 text-primary",
      icon: <Wallet className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />,
    });
  }

  if (listing.badgeAanbevolen) {
    badges.push({
      label: `Aanbevolen${listing.badgeAanbevolenBy ? ` door ${listing.badgeAanbevolenBy}` : ""}`,
      className: "bg-highlight/10 text-highlight",
      icon: <Star className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />,
    });
  }

  if ((listing.reviewCount ?? 0) >= 10 && (listing.averageRating ?? 0) >= 4.0) {
    badges.push({
      label: "Populair",
      className: "bg-warning/10 text-amber-700",
      icon: <TrendingUp className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />,
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${badge.className} ${
            size === "sm" ? "text-[10px]" : "text-xs"
          }`}
        >
          {badge.icon}
          {badge.label}
        </span>
      ))}
    </div>
  );
}
