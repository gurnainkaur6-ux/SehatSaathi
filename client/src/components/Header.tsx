import { ArrowLeft, User, LogOut } from "lucide-react";
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
  
  // Get user from storage safely
  const userStr = localStorage.getItem("sehat_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : "SS";

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => setLocation("/")
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md px-4 py-3 flex items-center justify-between min-h-[64px]">
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={() => window.history.back()}
            className="p-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-bold tracking-tight font-display">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {location !== "/" && (
          <>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 border-2 border-white/20 bg-primary-foreground/10 text-primary-foreground">
                <AvatarFallback className="bg-primary-700 text-xs">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-white/10 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
