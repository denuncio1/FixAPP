"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Settings as SettingsIcon } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

// Importar os novos componentes modulares
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import UserAccountsPermissions from "@/components/settings/UserAccountsPermissions";
import SecuritySettingsTab from "@/components/settings/SecuritySettingsTab";
import IntegrationsSettingsTab from "@/components/settings/IntegrationsSettingsTab";
import GeneralAppSettingsTab from "@/components/settings/GeneralAppSettingsTab";

const Settings = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState("general"); // Estado para a seção ativa

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderActiveSection = () => {
    switch (activeSettingsSection) {
      case "general":
        return <GeneralAppSettingsTab />;
      case "user_accounts":
        return <UserAccountsPermissions />;
      case "security":
        return <SecuritySettingsTab />;
      case "integrations":
        return <IntegrationsSettingsTab />;
      default:
        return <GeneralAppSettingsTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Configurações</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Configurações do Sistema</h2>
            <p className="text-muted-foreground">
              Gerencie as configurações gerais do seu aplicativo.
            </p>
          </div>

          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[70vh] rounded-lg border"
          >
            <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
              <SettingsSidebar
                activeSection={activeSettingsSection}
                onSelectSection={setActiveSettingsSection}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
              <div className="h-full p-6">
                {renderActiveSection()}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
    </div>
  );
};

export default Settings;