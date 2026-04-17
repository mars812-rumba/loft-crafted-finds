import { Flame, Dog, Trees, Table2, LibraryBig, CookingPot, type LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  { id: "grill", name: "Мангалы", icon: Flame },
  { id: "dog_cage", name: "Вольеры", icon: Dog },
  { id: "garden_furniture", name: "Садовая мебель", icon: Trees },
  { id: "table_and_base", name: "Столы и подстолья", icon: Table2 },
  { id: "shelf", name: "Стеллажи", icon: LibraryBig },
  { id: "stove", name: "Печи под казан", icon: CookingPot },
];

export const categoryById = (id: string) => categories.find((c) => c.id === id);
