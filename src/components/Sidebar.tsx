"use client";

import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Wrench, Package, Users, Settings, Map, Building2, PlusCircle, Truck, Briefcase, CalendarCheck, BellRing, History, Boxes, ArrowDownUp, BellDot, Link as LinkIcon, Trophy, MessageSquare, LifeBuoy, Headset, Leaf, Zap, Trash2, Camera, Bot, Gauge, FileText, ListChecks } from "lucide-react"; // Adicionado ListChecks para NRChecklist
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AppLogo from "./AppLogo";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const navItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/dashboard",
      type: "link",
    },
    {
      name: "Ordens de Serviço",
      icon: Wrench,
      path: "/work-orders",
      type: "link",
    },
    {
      name: "Solicitações de Trabalho", // Novo item
      icon: FileText, // Ícone para solicitações de trabalho
      path: "/work-requests", // Nova rota
      type: "link",
    },
    {
      name: "Manutenção",
      icon: CalendarCheck,
      type: "category",
      children: [
        {
          name: "Preventiva e Preditiva",
          icon: CalendarCheck,
          path: "/maintenance/preventive",
          type: "link",
        },
        {
          name: "Alertas Inteligentes",
          icon: BellRing,
          path: "/maintenance/alerts",
          type: "link",
        },
        {
          name: "Histórico de Manutenção",
          icon: History,
          path: "/maintenance/history",
          type: "link",
        },
        {
          name: "Reconhecimento de Imagem",
          icon: Camera,
          path: "/maintenance/image-recognition",
          type: "link",
        },
        {
          name: "Assistente Virtual",
          icon: Bot,
          path: "/maintenance/virtual-assistant",
          type: "link",
        },
        {
          name: "Medidores Digitais",
          icon: Gauge,
          path: "/maintenance/digital-meters",
          type: "link",
        },
        {
          name: "Checklist de Normativas", // NOVO ITEM
          icon: ListChecks, // Ícone para checklist
          path: "/maintenance/nr-checklist", // NOVA ROTA
          type: "link",
        },
      ],
    },
    {
      name: "Estoque e Materiais",
      icon: Boxes,
      type: "category",
      children: [
        {
          name: "Controle de Estoque",
          icon: Boxes,
          path: "/stock/control",
          type: "link",
        },
        {
          name: "Movimentação de Materiais",
          icon: ArrowDownUp,
          path: "/stock/movement",
          type: "link",
        },
        {
          name: "Alertas de Estoque",
          icon: BellDot,
          path: "/stock/alerts",
          type: "link",
        },
        {
          name: "Integração Fornecedores",
          icon: LinkIcon,
          path: "/stock/supplier-integration",
          type: "link",
        },
      ],
    },
    {
      name: "Cadastro",
      icon: PlusCircle,
      type: "category",
      children: [
        {
          name: "Técnico",
          icon: Users,
          path: "/technicians",
          type: "link",
        },
        {
          name: "Gestor",
          icon: Briefcase,
          path: "/managers/new",
          type: "link",
        },
        {
          name: "Localização",
          icon: Building2,
          path: "/locations",
          type: "link",
        },
        {
          name: "Ativos", // Este link agora vai para a lista de ativos
          icon: Package,
          path: "/assets", // Rota atualizada
          type: "link",
        },
        {
          name: "Clientes",
          icon: Users,
          path: "/clients",
          type: "link",
        },
        {
          name: "Fornecedores",
          icon: Truck,
          path: "/suppliers/new",
          type: "link",
        },
      ],
    },
    {
      name: "Planejador Automático",
      icon: Map,
      path: "/automatic-planner",
      type: "link",
    },
    {
      name: "Gamificação",
      icon: Trophy,
      path: "/gamification",
      type: "link",
    },
    {
      name: "Comunicação e Suporte",
      icon: LifeBuoy,
      type: "category",
      children: [
        {
          name: "Chat Interno",
          icon: MessageSquare,
          path: "/communication/chat",
          type: "link",
        },
        {
          name: "Central de Ajuda",
          icon: LifeBuoy,
          path: "/communication/help-center",
          type: "link",
        },
        {
          name: "Solicitar Suporte",
          icon: Headset,
          path: "/communication/support-request",
          type: "link",
        },
      ],
    },
    {
      name: "Módulo de Sustentabilidade",
      icon: Leaf,
      type: "category",
      children: [
        {
          name: "Consumo Energético",
          icon: Zap,
          path: "/sustainability/energy-consumption",
          type: "link",
        },
        {
          name: "Descarte de Resíduos",
          icon: Trash2,
          path: "/sustainability/waste-disposal",
          type: "link",
        },
      ],
    },
    {
      name: "Configurações",
      icon: Settings,
      path: "/settings",
      type: "link",
    },
  ];

  return (
    <div
      className={`flex h-full flex-col overflow-hidden border-r bg-sidebar transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <div className="flex h-16 items-center justify-center p-4">
        {!isCollapsed ? (
          <AppLogo className="h-10 w-auto" />
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
          <React.Fragment key={item.name}>
            {item.type === "link" && (
              <Button
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
            )}
            {item.type === "category" && (
              <>
                <div
                  className={cn(
                    "flex items-center text-sidebar-foreground font-semibold py-2",
                    isCollapsed ? "justify-center px-2" : "px-4",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-300">
                      {item.name}
                    </span>
                  )}
                </div>
                {!isCollapsed && item.children && (
                  <div className="ml-4 border-l border-sidebar-border pl-2">
                    {item.children.map((child) => (
                      <Button
                        key={child.name}
                        asChild
                        variant="ghost"
                        className={cn(
                          "mb-1 flex w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-4"
                        )}
                      >
                        <Link to={child.path}>
                          <child.icon className="h-5 w-5" />
                          <span className="ml-3 transition-opacity duration-300">
                            {child.name}
                          </span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </React.Fragment>
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