"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  Users, 
  Trophy, 
  Settings, 
  LayoutDashboard, 
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ScrollText,
  UserSquare2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function NavigationSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(true);

  // Helper to keep the league/team context when switching sub-pages
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const navItems = [
    { name: "Sports", href: "/sports", icon: LayoutDashboard },
    { name: "Leagues", href: "/leagues", icon: FileText },
    { name: "Athletes", href: "/athletes", icon: Users },
    { 
      name: "Teams", 
      href: "/teams", 
      icon: Trophy,
      children: [
        { name: "Contracts", href: "/teams/contracts", icon: ScrollText },
        { name: "Rosters", href: "/teams/rosters", icon: UserSquare2 }
      ]
    },
    { name: "Settings", href: "/references", icon: Settings },
  ];

  return (
    <div className={cn(
      "relative flex flex-col border-r bg-card transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center px-4 border-b">
        <div className="font-bold text-xl truncate">
          {isCollapsed ? "S" : "SportsApp"}
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.name} className="space-y-1">
              {/* Main Item */}
              <div className="group relative">
                <Link
                  href={item.href + (item.name === "Teams" ? queryString : "")}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive && !hasChildren
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isActive && hasChildren && "text-foreground bg-muted/50"
                  )}
                  onClick={(e) => {
                    if (hasChildren && !isCollapsed) {
                      setTeamsOpen(!teamsOpen);
                    }
                  }}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {hasChildren && (
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          teamsOpen ? "rotate-0" : "-rotate-90"
                        )} />
                      )}
                    </>
                  )}
                </Link>
              </div>

              {/* Sub-menu (Children) */}
              {!isCollapsed && hasChildren && teamsOpen && (
                <div className="ml-9 space-y-1">
                  {item.children?.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href + queryString}
                        className={cn(
                          "flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          isChildActive
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        <span>{child.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 border-t hover:bg-muted transition-colors flex items-center justify-center"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </div>
  );
}