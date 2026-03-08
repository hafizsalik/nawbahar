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
        "fixed top-0 left-0 right-0 z-40 glass safe-top transition-transform duration-300",
        "border-b-2 border-primary/20",
        !isVisible && "-translate-y-full"
      )}
    >
      <div className="flex items-center justify-between px-5 h-12 max-w-lg mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <span className="text-xl font-black tracking-tight text-primary transition-colors duration-200">
            نوبهار
          </span>
          <span className="text-[8px] font-semibold text-primary/40 mr-1 mt-1.5 tracking-widest">BETA</span>
        </Link>

        {/* Notifications */}
        <Link to="/notifications" className="relative p-2 -ml-2">
          <button 
            className={cn(
              "p-1.5 transition-all duration-200 focus:outline-none rounded-full",
              unreadCount > 0 
                ? "text-primary hover:bg-primary/8" 
                : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
            )}
            aria-label={`اعلانات ${unreadCount > 0 ? `(${unreadCount} خوانده نشده)` : ''}`}
          >
            <Bell size={18} strokeWidth={1.5} />
          </button>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-[16px] flex items-center justify-center text-[10px] font-bold text-primary-foreground bg-primary rounded-full px-1 animate-scale-in shadow-sm">
              {unreadCount > 9 ? "۹+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
