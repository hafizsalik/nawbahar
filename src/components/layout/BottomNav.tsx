import { Home, Compass, User, PenLine, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, path: "/", label: "خانه" },
  { icon: Compass, path: "/explore", label: "کاوش" },
  { icon: PenLine, path: "/write", label: "نوشتن", isWrite: true },
  { icon: Sparkles, path: "/vip", label: "ویژه" },
  { icon: User, path: "/profile", label: "پروفایل" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/30 safe-bottom no-print">
      <div className="flex items-center justify-around max-w-lg mx-auto h-14">
        {navItems.map(({ icon: Icon, path, label, isWrite }) => {
          const isActive = location.pathname === path || 
            (path === "/profile" && location.pathname.startsWith("/profile"));

          if (isWrite) {
            return (
              <Link
                key={path}
                to={path}
                className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 focus:outline-none min-h-[48px]"
                aria-label={label}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-primary/10 text-primary hover:bg-primary/20 active:scale-90"
                )}>
                  <Icon size={18} strokeWidth={2} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-4 py-2 transition-all duration-200 focus:outline-none rounded-lg min-h-[48px]",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground/50 hover:text-foreground active:scale-90"
              )}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.5}
                className={cn(
                  "transition-all duration-200",
                  isActive && "animate-bounce-subtle"
                )}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className={cn(
                "text-[9px] transition-opacity duration-200",
                isActive ? "font-bold opacity-100" : "font-normal opacity-70"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
