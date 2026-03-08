import { Home, Search, Bell, BookOpen, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";

const navItems = [
  { icon: Home, path: "/", label: "خانه" },
  { icon: Search, path: "/explore", label: "کاوش" },
  { icon: BookOpen, path: "/vip", label: "ویژه" },
  { icon: Bell, path: "/notifications", label: "اعلانات", isBell: true },
  { icon: User, path: "/profile", label: "من" },
];

export function BottomNav() {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 no-print">
      <div className="bg-background border-t border-border/60 safe-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto h-[50px]">
          {navItems.map(({ icon: Icon, path, label, isBell }) => {
            const isActive = location.pathname === path ||
              (path === "/profile" && location.pathname.startsWith("/profile"));

            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-[3px] w-16 h-full transition-colors duration-150 focus:outline-none",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground/60 hover:text-foreground/70"
                )}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.5}
                    fill={isActive ? "currentColor" : "none"}
                    className="transition-all duration-150"
                  />
                  {isBell && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center text-[8px] font-bold text-accent-foreground bg-accent rounded-full px-0.5">
                      {unreadCount > 9 ? "۹+" : unreadCount}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] leading-none",
                  isActive ? "font-bold" : "font-medium"
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
