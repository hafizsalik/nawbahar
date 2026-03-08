import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

export function Header() {
  const isVisible = useScrollDirection();

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 safe-top transition-all duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="bg-background border-b border-border/60">
        <div className="flex items-center justify-between px-5 h-12 max-w-lg mx-auto">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-1.5 group">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <span className="text-sm font-black text-primary-foreground leading-none">ن</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-black tracking-tight text-foreground leading-none">
                نوبهار
              </span>
              <span className="text-[6.5px] font-bold tracking-[0.2em] text-muted-foreground/50 leading-none mt-0.5">
                NOBAHAR
              </span>
            </div>
          </Link>

          {/* Write CTA */}
          <Link 
            to="/write" 
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 active:scale-95 transition-all duration-150"
          >
            <PenLine size={14} strokeWidth={2.2} />
            <span>بنویسید</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
