import { ArrowLeft, LogOut, HeartPulse } from "lucide-react";
import { useLocation } from "wouter";
import { useLogout } from "@/hooks/use-sehat-api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title = "SehatSaathi", showBack = false }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const logout = useLogout();

  const userStr = localStorage.getItem("sehat_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : "SS";

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => setLocation("/") });
  };

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md px-4 py-3 flex items-center justify-between min-h-[64px]">
      {/* Left: Back / Logo */}
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => window.history.back()}
            className="p-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors md:hidden"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}

        {/* Logo icon — only shown on mobile (sidebar shows it on desktop) */}
        <div className="flex items-center gap-2 md:hidden">
          <HeartPulse className="w-5 h-5 text-white/80" />
          <h1 className="text-lg font-bold tracking-tight font-display">{title}</h1>
        </div>

        {/* Desktop: just the page title */}
        <h1 className="hidden md:block text-lg font-bold tracking-tight font-display">{title}</h1>
      </div>

      {/* Right: Avatar + Logout */}
      {location !== "/" && (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border-2 border-white/20 bg-white/10">
            <AvatarFallback className="text-xs font-bold text-white bg-transparent">{initials}</AvatarFallback>
          </Avatar>
          {/* Logout shown in header on mobile; on desktop sidebar has it */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-white/10 hover:text-white md:hidden"
            data-testid="button-header-logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      )}
    </header>
  );
}
