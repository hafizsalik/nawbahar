import { Bell, Search, PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border safe-top">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-gold-dark flex items-center justify-center">
            <span className="text-accent-foreground font-serif font-bold text-lg">F</span>
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
            Fetrat
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Search size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="text-accent hover:text-accent/80">
            <PenLine size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
