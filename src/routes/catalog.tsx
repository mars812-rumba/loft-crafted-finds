import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Header } from "@/components/Header";
import { inventory, getImage } from "@/data/inventory";
import { categories, categoryById } from "@/data/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler, Weight, Layers, Eye, CheckCircle2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

type Availability = "all" | "in_stock" | "custom";
type Sort = "price_asc" | "price_desc" | "name";
interface CatalogSearch {
  category: string;
  availability: Availability;
  sort: Sort;
  maxPrice: number;
}

export const Route = createFileRoute("/catalog")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => {
    const av = search.availability;
    const so = search.sort;
    return {
      category: typeof search.category === "string" ? search.category : "",
      availability: av === "in_stock" || av === "custom" ? av : "all",
      sort: so === "price_desc" || so === "name" ? so : "price_asc",
      maxPrice: Number(search.maxPrice) || 0,
    };
  },
  head: () => ({
    meta: [
      { title: "Каталог — LoftFire" },
      { name: "description", content: "Каталог изделий: мангалы, печи, стеллажи, столы, садовая мебель." },
      { property: "og:title", content: "Каталог LoftFire" },
      { property: "og:description", content: "Изделия из металла и дерева в стиле лофт." },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { category, availability, sort, maxPrice } = Route.useSearch();
  const navigate = useNavigate({ from: "/catalog" });

  const filtered = useMemo(() => {
    let list = inventory.slice();
    if (category) list = list.filter((i) => i.category === category);
    if (availability !== "all") list = list.filter((i) => i.availability === availability);
    if (maxPrice > 0) list = list.filter((i) => i.price <= maxPrice);
    list.sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      return a.name.localeCompare(b.name, "ru");
    });
    return list;
  }, [category, availability, sort, maxPrice]);

  type SearchState = { category: string; availability: "all" | "in_stock" | "custom"; sort: "price_asc" | "price_desc" | "name"; maxPrice: number };
  const update = (patch: Partial<SearchState>) => {
    navigate({ search: (prev: SearchState) => ({ ...prev, ...patch }) });
  };

  const cat = categoryById(category);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5 flex items-center gap-2">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Назад</Link>
        </div>

        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {cat ? cat.name : "Каталог"}
          </h1>
          <span className="text-sm text-muted-foreground">{filtered.length} товаров</span>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-3 sm:grid-cols-4 sm:p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Категория</label>
            <Select value={category || "all"} onValueChange={(v) => update({ category: v === "all" ? "" : v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Наличие</label>
            <Select value={availability} onValueChange={(v) => update({ availability: v as "all" | "in_stock" | "custom" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любое</SelectItem>
                <SelectItem value="in_stock">В наличии</SelectItem>
                <SelectItem value="custom">Под заказ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Макс. цена ₽</label>
            <Input
              type="number"
              min={0}
              value={maxPrice || ""}
              onChange={(e) => update({ maxPrice: Number(e.target.value) || 0 })}
              placeholder="без ограничений"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Сортировка</label>
            <Select value={sort} onValueChange={(v) => update({ sort: v as "price_asc" | "price_desc" | "name" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="price_asc">Цена ↑</SelectItem>
                <SelectItem value="price_desc">Цена ↓</SelectItem>
                <SelectItem value="name">Название</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            Ничего не найдено. Попробуйте сбросить фильтры.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => <ProductCard key={item.id} item={item} />)}
          </div>
        )}
      </main>
    </div>
  );
}

function ProductCard({ item }: { item: typeof inventory[number] }) {
  const cat = categoryById(item.category);
  const inStock = item.availability === "in_stock";
  return (
    <Link
      to="/item/$id"
      params={{ id: item.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={getImage(item.id)}
          alt={item.name}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {cat && (
            <Badge className="bg-background/90 text-foreground backdrop-blur hover:bg-background/90">
              {cat.name}
            </Badge>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <Badge
            className={cn(
              "backdrop-blur",
              inStock
                ? "bg-success/90 text-success-foreground hover:bg-success/90"
                : "bg-ember/90 text-ember-foreground hover:bg-ember/90",
            )}
          >
            {inStock ? <><CheckCircle2 className="mr-1 h-3 w-3" /> В наличии</> : <><Wrench className="mr-1 h-3 w-3" /> Под заказ</>}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground">{item.name}</h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Ruler className="h-3.5 w-3.5" /> {item.dimensions.width}×{item.dimensions.length} мм</span>
          <span className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {item.dimensions.height} мм</span>
          <span className="inline-flex items-center gap-1"><Weight className="h-3.5 w-3.5" /> {item.dimensions.weight} кг</span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-2 pt-2">
          <div>
            <div className="text-xs text-muted-foreground">Цена</div>
            <div className="text-xl font-bold text-foreground">
              {item.price.toLocaleString("ru-RU")} ₽
            </div>
          </div>
          <Button variant="ember" size="sm" className="shrink-0">
            <Eye className="h-4 w-4" /> Посмотреть
          </Button>
        </div>
      </div>
    </Link>
  );
}
