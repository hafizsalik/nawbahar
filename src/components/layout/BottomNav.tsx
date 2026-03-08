import { House, Search, Crown, PenLine, CircleUserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const navItems = [
  { icon: House, path: "/", label: "خانه" },
  { icon: Search, path: "/explore", label: "جستجو" },
  { icon: Crown, path: "/vip", label: "ویژه" },
  { icon: PenLine, path: "/write", label: "نوشتن" },
  { icon: CircleUserRound, path: "/profile", label: "پروفایل" },
];

export function BottomNav() {
  const location = useLocation();
  const isVisible = useScrollDirection();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 no-print transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="bg-background border-t border-border safe-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto h-14">
          {navItems.map(({ icon: Icon, path, label }) => {
            const isActive = location.pathname === path ||
              (path === "/profile" && location.pathname.startsWith("/profile"));

            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200 focus:outline-none",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/50 active:text-muted-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-[2.5px] rounded-b-full bg-primary animate-scale-in" />
                )}
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.5}
                  className={cn(
                    "transition-all duration-200",
                    isActive && "animate-bounce-subtle"
                  )}
                />
                <span className={cn(
                  "text-[9px] font-medium transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-0 scale-90"
                )}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
