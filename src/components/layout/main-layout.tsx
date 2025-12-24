import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";

interface MainLayoutProps {
  user?: {
    username: string;
    email: string;
  };
}

export function MainLayout({}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Subtle gradient orbs for depth - hidden on mobile for performance */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="hidden sm:block absolute top-0 left-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-primary/3 dark:bg-primary/6 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute bottom-0 right-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-chart-1/3 dark:bg-chart-1/6 rounded-full blur-3xl" />
        <div className="hidden md:block absolute top-1/2 right-0 w-56 md:w-72 h-56 md:h-72 bg-chart-2/3 dark:bg-chart-2/6 rounded-full blur-3xl" />
      </div>
      
      <Navbar />
      
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 lg:py-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

