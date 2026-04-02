import { Link, useLocation } from "wouter";
import { Home, Pill, FileText, Stethoscope, HeartPulse, LogOut, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/use-sehat-api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/medicines", icon: Pill, label: "Medicines" },
  { href: "/records", icon: FileText, label: "Health Records" },
  { href: "/doctor", icon: Stethoscope, label: "Doctor Chat" },
];

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const logout = useLogout();

  const userStr = localStorage.getItem("sehat_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : "SS";

  if (location === "/") return null;

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => setLocation("/") });
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-gray-100 min-h-screen sticky top-0 shadow-sm">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-2xl p-2.5 shadow-md shadow-primary/20">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary font-display leading-tight">SehatSaathi</h1>
            <p className="text-[11px] text-gray-400">Your health companion</p>
          </div>
        </div>
      </div>

      {/* User Card */}
      {user && (
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="bg-primary/5 rounded-xl p-3 flex items-center gap-3">
            <Avatar className="w-9 h-9 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-white text-sm font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate capitalize">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">+91 {user.phoneNumber}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-3">Menu</p>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                data-testid={`sidebar-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-gray-400 group-hover:text-primary")} />
                <span className="text-sm font-semibold">{label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Emergency */}
      <div className="px-3 mb-4">
        <button
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors group"
          onClick={() => {
            const utterance = new SpeechSynthesisUtterance("Calling emergency services");
            window.speechSynthesis.speak(utterance);
          }}
          data-testid="sidebar-button-sos"
        >
          <div className="bg-red-500 text-white p-1.5 rounded-lg animate-pulse">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold">Emergency SOS</p>
            <p className="text-[10px] text-red-400">Call 108</p>
          </div>
        </button>
      </div>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-gray-100 pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-11"
          onClick={handleLogout}
          data-testid="sidebar-button-logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Log Out</span>
        </Button>
      </div>
    </aside>
  );
}
