import { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideNav?: boolean;
}

export function AppLayout({ children, hideHeader, hideNav }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {!hideHeader && <Header />}
      <main className={`${!hideNav ? 'pb-20' : ''} max-w-lg mx-auto`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
