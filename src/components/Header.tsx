import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="LoftFire" className="h-9 w-9 object-contain" width={36} height={36} />
          <span className="text-lg font-bold tracking-tight text-foreground">LoftFire</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "rounded-md px-3 py-1.5 font-semibold text-foreground bg-secondary" }}
          >
            Главная
          </Link>
          <Link
            to="/catalog"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-1.5 font-semibold text-foreground bg-secondary" }}
          >
            Каталог
          </Link>
        </nav>
      </div>
    </header>
  );
}
