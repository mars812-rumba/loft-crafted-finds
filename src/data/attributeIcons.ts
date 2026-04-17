import {
  Ruler, Weight, Layers, Wind, Utensils, CircleDot, BookOpen, Thermometer,
  Trash2, Flame, ToggleLeft, Lock, Box, Square, Mountain, Hammer, Palette,
  ArrowUpDown, BarChart3, Cable, Monitor, Keyboard, Move3d, GalleryHorizontal,
  Users, Shield, type LucideIcon,
} from "lucide-react";

export const attributeMeta: Record<string, { label: string; icon: LucideIcon; suffix?: string }> = {
  thickness_steel: { label: "Толщина стали", icon: Layers, suffix: " мм" },
  chimney_height: { label: "Дымоход", icon: Wind, suffix: " мм" },
  skewers_capacity: { label: "Шампуры", icon: Utensils, suffix: " шт" },
  kazan_ring: { label: "Кольцо под казан", icon: CircleDot },
  kazan_volume: { label: "Объём казана", icon: CircleDot },
  lid: { label: "Крышка", icon: BookOpen },
  grill_grate: { label: "Решётка-гриль", icon: Square },
  thermometer: { label: "Термометр", icon: Thermometer },
  ash_drawer: { label: "Зольник", icon: Trash2 },
  firewood_niche: { label: "Дровница", icon: Flame },
  damper: { label: "Заслонка", icon: ToggleLeft },
  draft_control: { label: "Регулировка тяги", icon: ToggleLeft },
  chimney: { label: "Дымоход", icon: Wind },
  bars_profile: { label: "Профиль прута", icon: Box },
  door_lock: { label: "Замок двери", icon: Lock },
  tray: { label: "Поддон", icon: Square },
  countertop: { label: "Столешница", icon: Table2Icon },
  assembly_time: { label: "Сборка", icon: Hammer },
  set_composition: { label: "Состав", icon: Layers },
  seats_count: { label: "Мест", icon: Users },
  wood_species: { label: "Порода", icon: Mountain },
  wood_treatment: { label: "Покрытие", icon: Palette },
  wood_color: { label: "Цвет дерева", icon: Palette },
  table_length: { label: "Длина стола", icon: Ruler, suffix: " мм" },
  bench_length: { label: "Длина лавки", icon: Ruler, suffix: " мм" },
  shape: { label: "Форма", icon: Square },
  adjustable_feet: { label: "Регул. ножки", icon: ArrowUpDown },
  max_load: { label: "Макс. нагрузка", icon: Weight, suffix: " кг" },
  legs_count: { label: "Ножки", icon: BarChart3, suffix: " шт" },
  profile_thickness: { label: "Толщина профиля", icon: Layers, suffix: " мм" },
  shelves_count: { label: "Полок", icon: BarChart3, suffix: " шт" },
  shelf_material: { label: "Материал полок", icon: Mountain },
  shelf_color: { label: "Цвет полок", icon: Palette },
  mount_type: { label: "Крепление", icon: Shield },
  max_load_per_shelf: { label: "На полку", icon: Weight, suffix: " кг" },
  shelf_spacing: { label: "Шаг полок", icon: Ruler, suffix: " мм" },
  tabletop_material: { label: "Материал столешницы", icon: Mountain },
  tabletop_color: { label: "Цвет столешницы", icon: Palette },
  tabletop_thickness: { label: "Толщина столешницы", icon: Layers, suffix: " мм" },
  drawers: { label: "Ящики", icon: GalleryHorizontal, suffix: " шт" },
  cable_management: { label: "Кабель-канал", icon: Cable },
  monitor_shelf: { label: "Полка под монитор", icon: Monitor },
  keyboard_shelf: { label: "Полка под клавиатуру", icon: Keyboard },
  height_adjustment: { label: "Регул. высоты", icon: Move3d },
};

import { Table2 as Table2Icon } from "lucide-react";

export function formatAttrValue(value: unknown, suffix?: string): string {
  if (typeof value === "boolean") return value ? "Да" : "Нет";
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined) return "—";
  return `${value}${suffix ?? ""}`;
}
