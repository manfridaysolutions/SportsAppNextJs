"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Trophy, 
  Settings, 
  LayoutDashboard, 
  FileText,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Standard shadcn utility

const navItems = [
  { name: "Sports", href: "/sports", icon: LayoutDashboard },
  { name: "Leagues", href: "/leagues", icon: FileText },
  { name: "Athletes", href: "/athletes", icon: Users },
  { name: "Teams", href: "/teams", icon: Trophy },
  { name: "Settings", href: "/references", icon: Settings },
];

export function NavigationSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative flex flex-col border-r bg-card transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header / Logo */}
      <div className="flex h-16 items-center px-4 border-b">
        <div className="font-bold text-xl truncate">
          {isCollapsed ? "S" : "SportsApp"}
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1 p-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 border-t hover:bg-muted transition-colors flex items-center justify-center"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </div>
  );
}