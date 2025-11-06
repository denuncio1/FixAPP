"use client";

import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Wrench, Package, Users, Settings, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const navItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      name: "Ordens de Serviço",
      icon: Wrench,
      path: "/work-orders",
    },
    {
      name: "Ativos",
      icon: Package,
      path: "/assets",
    },
    {
      name: "Técnicos",
      icon: Users,
      path: "/technicians",
    },
    {
      name: "Planejador Automático",
      icon: Map,
      path: "/automatic-planner",
    },
    {
      name: "Configurações",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-center p-4">
        {!isCollapsed ? (
          <img src="/logo.png" alt="FixApp Logo" className="h-10 w-auto" />
        ) : (
          <Wrench
            className="text-sidebar-primary-foreground transition-opacity duration-300"
            size={24}
          />
        )}
      </div>
      <Separator className="bg-sidebar-border" />
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <Button
            key={item.name}
            asChild
            variant="ghost"
            className={cn(
              "mb-1 flex w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isCollapsed ? "px-2" : "px-4",
            )}
          >
            <Link to={item.path}>
              <item.icon className="h-5 w-5" />
              {!isCollapsed && (
                <span className="ml-3 transition-opacity duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          </Button>
        ))}
      </nav>
      <Separator className="bg-sidebar-border" />
      <div className="p-4 text-center">
        <Link
          to="https://www.dyad.sh/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-opacity duration-300",
            isCollapsed ? "opacity-0" : "opacity-100",
          )}
        >
          Feito com Dyad
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;