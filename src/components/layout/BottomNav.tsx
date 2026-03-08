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
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom no-print pb-1">
      <div className="mx-3 mb-2">
        <div className="glass rounded-2xl border border-border/40 float-element">
          <div className="flex items-center justify-around max-w-lg mx-auto h-14">
            {navItems.map(({ icon: Icon, path, label, isWrite }) => {
              const isActive = location.pathname === path || 
                (path === "/profile" && location.pathname.startsWith("/profile"));

              if (isWrite) {
                return (
                  <Link
                    key={path}
                    to={path}
                    className="flex items-center justify-center focus:outline-none"
                    aria-label={label}
                  >
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "bg-gradient-to-br from-primary/15 to-accent/15 text-primary hover:from-primary/25 hover:to-accent/25 active:scale-90"
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
                    "flex flex-col items-center justify-center gap-0.5 px-3 py-2 transition-all duration-200 focus:outline-none rounded-xl min-h-[48px] relative",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground/50 hover:text-foreground active:scale-90"
                  )}
                  aria-label={label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full animate-scale-in" />
                  )}
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.2 : 1.5}
                    className={cn(
                      "transition-all duration-200",
                      isActive && "animate-bounce-subtle"
                    )}
                    fill={isActive ? "currentColor" : "none"}
                  />
                  <span className={cn(
                    "text-[9px] transition-all duration-200",
                    isActive ? "font-bold opacity-100" : "font-normal opacity-60"
                  )}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
