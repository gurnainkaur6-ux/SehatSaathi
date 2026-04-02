import { Link, useLocation } from "wouter";
import { Home, Pill, FileText, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/medicines", icon: Pill, label: "Meds" },
    { href: "/records", icon: FileText, label: "Records" },
    { href: "/doctor", icon: Stethoscope, label: "Doctor" },
  ];

  if (location === "/") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:hidden">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location === href;
          return (
            <Link
              key={href}
              href={href}
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform"
              data-testid={`bottom-nav-${label.toLowerCase()}`}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 w-full h-full border-t-2",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
