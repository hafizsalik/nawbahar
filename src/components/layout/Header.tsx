import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";

export function Header() {
  const isVisible = useScrollDirection();
  const { unreadCount } = useNotifications();

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-card border-b border-border safe-top transition-transform duration-300",
        !isVisible && "-translate-y-full"
      )}
    >
      <div className="flex items-center justify-between px-4 h-11 max-w-lg mx-auto">
        {/* Logo - Right (RTL) */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-black tracking-tight text-foreground">
            نوبهار
          </span>
        </Link>

        {/* Actions - Left (RTL) */}
        <div className="flex items-center gap-1">
          {/* About/Info */}
          <Link to="/about">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <Info size={18} strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
