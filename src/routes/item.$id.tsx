import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { getItem, getImage } from "@/data/inventory";
import { categoryById } from "@/data/categories";
import { attributeMeta, formatAttrValue } from "@/data/attributeIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequestForm } from "@/components/RequestForm";
import {
  Ruler, Weight, Box, Palette, CheckCircle2, Wrench, Truck, ShieldCheck,
  Hammer, Sparkles, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/item/$id")({
  loader: ({ params }) => {
    const item = getItem(params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    const item = loaderData?.item;
    if (!item) return { meta: [{ title: "Товар — LoftFire" }] };
    return {
      meta: [
        { title: `${item.name} — LoftFire` },
        { name: "description", content: item.description },
        { property: "og:title", content: item.name },
        { property: "og:description", content: item.description },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background"><Header /><div className="p-8 text-center text-muted-foreground">{error.message}</div></div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Товар не найден</p>
        <Link to="/catalog" search={{ category: "", availability: "all", sort: "price_asc", maxPrice: 0 }} className="mt-4 inline-block text-ember underline">К каталогу</Link>
      </div>
    </div>
  ),
  component: ItemPage,
});

function ItemPage() {
  const { item } = Route.useLoaderData();
  const cat = categoryById(item.category);
  const cover = getImage(item.id);
  // gallery: same image multiple views (placeholder for real gallery)
  const gallery = [cover, cover, cover].slice(0, item.images.gallery.length || 1);
  const [active, setActive] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const inStock = item.availability === "in_stock";

  const attrEntries = Object.entries(item.attributes);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6 pb-32 sm:pb-6">
        <div className="mb-4">
          <Link
            to="/catalog"
            search={{ category: item.category, availability: "all", sort: "price_asc", maxPrice: 0 }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← {cat?.name ?? "Каталог"}
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
              <img
                src={gallery[active]}
                alt={item.name}
                width={1024}
                height={768}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={cn(
                      "h-16 w-20 overflow-hidden rounded-lg border-2 transition-all",
                      active === i ? "border-ember" : "border-border opacity-60 hover:opacity-100",
                    )}
                  >
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Selling badges */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <SellBadge icon={Hammer} title="Ручная работа" />
              <SellBadge icon={ShieldCheck} title="Гарантия 2 года" />
              <SellBadge icon={Truck} title="Доставка по РФ" />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap gap-2">
              {cat && <Badge variant="secondary">{cat.name}</Badge>}
              <Badge
                className={cn(
                  inStock ? "bg-success text-success-foreground hover:bg-success" : "bg-ember text-ember-foreground hover:bg-ember",
                )}
              >
                {inStock ? <><CheckCircle2 className="mr-1 h-3 w-3" /> В наличии</> : <><Wrench className="mr-1 h-3 w-3" /> Под заказ</>}
              </Badge>
              {item.type === "custom" && (
                <Badge className="bg-foreground text-background hover:bg-foreground">
                  <Sparkles className="mr-1 h-3 w-3" /> Индивидуально
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{item.name}</h1>
            <p className="mt-3 text-muted-foreground">{item.description}</p>

            {/* General specs */}
            <div className="mt-5 rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Общие характеристики
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Spec icon={Ruler} label="Ш×Д" value={`${item.dimensions.width}×${item.dimensions.length}`} suffix="мм" />
                <Spec icon={Ruler} label="Высота" value={item.dimensions.height} suffix="мм" />
                <Spec icon={Weight} label="Вес" value={item.dimensions.weight} suffix="кг" />
                <Spec icon={Box} label="Материал" value={item.base_specs.material === "metal" ? "Металл" : item.base_specs.material} />
                <Spec icon={Palette} label="Цвет" value={item.base_specs.color === "black" ? "Чёрный" : item.base_specs.color} />
              </div>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-end justify-between rounded-2xl border border-border bg-[image:var(--gradient-warm)] p-5">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Цена</div>
                <div className="text-3xl font-bold text-foreground">
                  {item.price.toLocaleString("ru-RU")} ₽
                </div>
              </div>
              <Button variant="hero" size="lg" onClick={() => setFormOpen(true)} className="hidden sm:inline-flex">
                <MessageCircle className="h-5 w-5" /> Оставить заявку
              </Button>
            </div>

            {/* Attributes */}
            {attrEntries.length > 0 && (
              <div className="mt-5 rounded-2xl border border-border bg-card p-4">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Атрибуты
                </h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {attrEntries.map(([key, value]) => {
                    const meta = attributeMeta[key];
                    const Icon = meta?.icon;
                    const label = meta?.label ?? key;
                    return (
                      <div key={key} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/50 p-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                          {Icon ? <Icon className="h-4 w-4" /> : <Box className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-muted-foreground">{label}</div>
                          <div className="text-sm font-medium text-foreground">
                            {formatAttrValue(value, meta?.suffix)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Цена</div>
            <div className="text-lg font-bold text-foreground">{item.price.toLocaleString("ru-RU")} ₽</div>
          </div>
          <Button variant="hero" size="lg" onClick={() => setFormOpen(true)} className="flex-1">
            Заявка
          </Button>
        </div>
      </div>

      <RequestForm open={formOpen} onOpenChange={setFormOpen} productName={item.name} />
    </div>
  );
}

function Spec({
  icon: Icon, label, value, suffix,
}: { icon: typeof Ruler; label: string; value: string | number; suffix?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-ember" />
      <div className="min-w-0">
        <div className="text-[11px] uppercase text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-semibold text-foreground">
          {value}{suffix ? ` ${suffix}` : ""}
        </div>
      </div>
    </div>
  );
}

function SellBadge({ icon: Icon, title }: { icon: typeof Ruler; title: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3 text-center">
      <Icon className="h-5 w-5 text-ember" />
      <div className="text-xs font-medium text-foreground">{title}</div>
    </div>
  );
}
