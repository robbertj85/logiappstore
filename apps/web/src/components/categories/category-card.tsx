import Link from "next/link";
import type { Category } from "@logiappstore/shared";
import {
  Truck, Route, Car, Warehouse as WarehouseIcon, Users, Banknote, UserCog, FileText, Globe,
  ShieldCheck, Lock, Cog, Navigation, Monitor, Radio, Gauge, Phone, ClipboardCheck,
  Landmark, Layers, BarChart3,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Truck className="h-8 w-8" />,
  Truck: <Truck className="h-8 w-8" />,
  Route: <Route className="h-8 w-8" />,
  Car: <Car className="h-8 w-8" />,
  Warehouse: <WarehouseIcon className="h-8 w-8" />,
  Users: <Users className="h-8 w-8" />,
  Banknote: <Banknote className="h-8 w-8" />,
  UserCog: <UserCog className="h-8 w-8" />,
  FileText: <FileText className="h-8 w-8" />,
  Globe: <Globe className="h-8 w-8" />,
  ShieldCheck: <ShieldCheck className="h-8 w-8" />,
  Lock: <Lock className="h-8 w-8" />,
  Cog: <Cog className="h-8 w-8" />,
  Navigation: <Navigation className="h-8 w-8" />,
  Monitor: <Monitor className="h-8 w-8" />,
  Radio: <Radio className="h-8 w-8" />,
  Gauge: <Gauge className="h-8 w-8" />,
  Phone: <Phone className="h-8 w-8" />,
  ClipboardCheck: <ClipboardCheck className="h-8 w-8" />,
  Landmark: <Landmark className="h-8 w-8" />,
  Layers: <Layers className="h-8 w-8" />,
  BarChart3: <BarChart3 className="h-8 w-8" />,
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const childCount = category.children?.length ?? 0;

  return (
    <Link href={`/categories/${category.slug}`} className="group">
      <div className="card p-6 h-full flex flex-col items-start hover:border-highlight/30 transition-colors">
        <div className="w-14 h-14 rounded-lg bg-highlight/10 text-highlight flex items-center justify-center mb-4 group-hover:bg-highlight/20 transition-colors">
          {category.icon && iconMap[category.icon] ? iconMap[category.icon] : <Cog className="h-8 w-8" />}
        </div>
        <h3 className="text-sm font-bold text-primary group-hover:text-highlight transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
        {childCount > 0 && (
          <span className="mt-auto pt-2 text-xs text-highlight font-medium">
            {childCount} subcategorieën
          </span>
        )}
      </div>
    </Link>
  );
}
