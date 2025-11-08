"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Settings as SettingsIcon,
  Users,
  Plug,
  Shield,
  ScrollText,
  Calendar,
  LayoutDashboard,
  DollarSign,
  BookOpen,
  Cloud,
  Code,
  Building,
} from "lucide-react";

interface SettingsSidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const sections = [
    {
      id: "general",
      name: "Geral",
      icon: SettingsIcon,
    },
    {
      id: "user_accounts",
      name: "Contas de Usuário",
      icon: Users,
    },
    {
      id: "security",
      name: "Segurança",
      icon: Shield,
    },
    {
      id: "integrations",
      name: "Integrações",
      icon: Plug,
    },
    // Adicione outras seções conforme a imagem, se necessário
    // { id: "calendar", name: "Calendário", icon: Calendar },
    // { id: "modules", name: "Módulos", icon: LayoutDashboard },
    // { id: "financeiro", name: "Financeiro", icon: DollarSign },
    // { id: "aux_catalogs", name: "Catálogos Auxiliares", icon: BookOpen },
    // { id: "doc_management", name: "Gerenciamento de Documentos", icon: ScrollText },
    // { id: "transaction_log", name: "Log de Transações", icon: ScrollText },
    // { id: "api_connections", name: "Conexões API", icon: Code },
    // { id: "guest_portal", name: "Portal de Convidados", icon: Building },
    // { id: "account", name: "Conta", icon: Users },
  ];

  return (
    <div className="flex flex-col space-y-1 p-4">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant="ghost"
          className={cn(
            "justify-start",
            activeSection === section.id && "bg-muted hover:bg-muted",
          )}
          onClick={() => onSelectSection(section.id)}
        >
          <section.icon className="mr-2 h-4 w-4" />
          {section.name}
        </Button>
      ))}
    </div>
  );
};

export default SettingsSidebar;