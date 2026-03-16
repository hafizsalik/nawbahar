import { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideNav?: boolean;
  className?: string;
}

export function AppLayout({ children, hideHeader, hideNav, className }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-200 ease-out">
<<<<<<< HEAD
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:bg-card focus:text-foreground focus:px-3 focus:py-2 focus:rounded-md">برو به محتوا</a>
      {!hideHeader && <Header />}
      <main
        id="main-content"
=======
      {!hideHeader && <Header />}
      <main 
>>>>>>> 4cd2633 (commit the changes on lovable)
        className={`${!hideNav ? 'pb-20' : ''} w-full mx-auto max-w-[940px] px-3 sm:px-4 md:px-6 lg:px-8 flex-1 ${className || ''} animate-fade-in`}
        role="main"
      >
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
