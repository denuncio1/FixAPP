"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, Shield, UserCog, Lock, ScrollText } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Settings = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleBiometricsChange = (checked: boolean) => {
    setBiometricsEnabled(checked);
    toast.info(`Autenticação por Biometria ${checked ? "ativada" : "desativada"}.`);
  };

  const handleTwoFactorAuthChange = (checked: boolean) => {
    setTwoFactorAuthEnabled(checked);
    toast.info(`Autenticação em Dois Fatores ${checked ? "ativada" : "desativada"}.`);
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

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Segurança e Permissões
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Perfis de Acesso */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <UserCog className="h-4 w-4" /> Perfis de Acesso
                  </h3>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    <li>**Administrador:** Acesso total a todas as funcionalidades e configurações.</li>
                    <li>**Técnico:** Acesso a ordens de serviço atribuídas, checklists, histórico de manutenção.</li>
                    <li>**Cliente:** Acesso limitado para visualizar o status de suas ordens de serviço.</li>
                  </ul>
                  <Button variant="link" className="pl-0 mt-2">Gerenciar Perfis</Button>
                </div>

                {/* Autenticação */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Autenticação
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-auth" className="text-sm font-medium">Autenticação por Senha</Label>
                      <Switch id="password-auth" checked={true} disabled /> {/* Senha sempre ativa */}
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="biometrics-auth" className="text-sm font-medium">Autenticação por Biometria</Label>
                      <Switch
                        id="biometrics-auth"
                        checked={biometricsEnabled}
                        onCheckedChange={handleBiometricsChange}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="two-factor-auth" className="text-sm font-medium">Autenticação em Dois Fatores (2FA)</Label>
                      <Switch
                        id="two-factor-auth"
                        checked={twoFactorAuthEnabled}
                        onCheckedChange={handleTwoFactorAuthChange}
                      />
                    </div>
                  </div>
                  <Button variant="link" className="pl-0 mt-2">Configurar Métodos de Autenticação</Button>
                </div>

                {/* Logs de Auditoria */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ScrollText className="h-4 w-4" /> Logs de Auditoria
                  </h3>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    <li>**Alterações:** Registra todas as modificações em dados e configurações.</li>
                    <li>**Acessos:** Monitora logins, tentativas de acesso e atividades de usuários.</li>
                    <li>**Exclusões:** Grava a remoção de quaisquer registros ou recursos.</li>
                  </ul>
                  <Button variant="link" className="pl-0 mt-2">Visualizar Logs Completos</Button>
                </div>
              </CardContent>
            </Card>

            {/* Outras configurações podem ser adicionadas aqui */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Esta seção pode conter outras configurações do sistema.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;