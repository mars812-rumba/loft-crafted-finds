import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { categories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LoftFire — Изделия из металла и дерева в стиле лофт" },
      {
        name: "description",
        content:
          "Мангалы, печи, стеллажи, столы и садовая мебель ручной работы. Прочная сталь, натуральное дерево, лофт-стиль.",
      },
      { property: "og:title", content: "LoftFire — Изделия из металла и дерева" },
      { property: "og:description", content: "Мангалы, печи, столы и мебель в стиле лофт. Под заказ и в наличии." },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const openCatalog = () => {
    if (!selected) return;
    navigate({ to: "/catalog", search: { category: selected } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Изделия из металла и дерева
          </h1>
          <p className="mt-3 text-muted-foreground">
            Выберите категорию — откройте каталог
          </p>
        </section>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = selected === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={cn(
                  "group relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 transition-all",
                  active
                    ? "border-ember bg-ember/5 shadow-[var(--shadow-soft)] scale-[1.02]"
                    : "border-border bg-card hover:border-muted-foreground/40 hover:bg-secondary/40",
                )}
                aria-pressed={active}
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
                    active
                      ? "bg-[image:var(--gradient-ember)] text-ember-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-secondary",
                  )}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <span
                  className={cn(
                    "text-center text-sm font-semibold leading-tight transition-colors",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="sticky bottom-4 mt-8 sm:static sm:mt-10">
          <Button
            variant={selected ? "hero" : "secondary"}
            size="lg"
            disabled={!selected}
            onClick={openCatalog}
            className="h-14 w-full rounded-2xl text-base"
          >
            Открыть каталог
            {selected && <ArrowRight className="ml-1 h-5 w-5" />}
          </Button>
        </div>
      </main>
    </div>
  );
}
