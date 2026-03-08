import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";

export function Header() {
  const isVisible = useScrollDirection();
  const { unreadCount } = useNotifications();

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 safe-top transition-all duration-400",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {/* Frosted glass container */}
      <div className="mx-3 mt-2">
        <div className="glass rounded-2xl border border-border/40 float-element">
          <div className="flex items-center justify-between px-5 h-12 max-w-lg mx-auto">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-1.5 group">
              {/* Logo mark */}
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-sm font-black text-primary-foreground leading-none">ن</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-foreground leading-none">
                  نوبهار
                </span>
                <span className="text-[7px] font-bold tracking-[0.2em] text-accent leading-none mt-0.5">
                  NOBAHAR
                </span>
              </div>
            </Link>

            {/* Notifications */}
            <Link to="/notifications" className="relative">
              <button 
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                  unreadCount > 0 
                    ? "bg-primary/10 text-primary hover:bg-primary/15" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
                aria-label={`اعلانات ${unreadCount > 0 ? `(${unreadCount} خوانده نشده)` : ''}`}
              >
                <Bell size={17} strokeWidth={1.8} />
              </button>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[9px] font-bold text-primary-foreground bg-accent rounded-full px-1 animate-scale-in ring-2 ring-card">
                  {unreadCount > 9 ? "۹+" : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
