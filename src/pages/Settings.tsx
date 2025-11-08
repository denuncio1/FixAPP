"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, Shield, UserCog, Lock, ScrollText, Plug, Database, Cloud, Building, Code, Sun, Moon, Settings } from "lucide-react"; // Adicionado 'Settings' aqui
import Sidebar from "@/components/Sidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Settings = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Estado para o tema

  useEffect(() => {
    // Carrega o tema salvo no localStorage ou detecta a preferência do sistema
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

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

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast.info(`Modo ${newTheme === 'dark' ? "Escuro" : "Claro"} ativado.`);
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

            {/* Nova Seção: Integrações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plug className="h-5 w-5" /> Integrações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Database className="h-4 w-4" /> ERP e Sistemas Financeiros
                  </h3>
                  <p className="text-muted-foreground">
                    Conecte o FixApp ao seu sistema ERP e financeiro para sincronizar dados de clientes, faturamento e estoque.
                  </p>
                  <Button variant="link" className="pl-0 mt-2">Gerenciar Integração ERP</Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Cloud className="h-4 w-4" /> IoT e Sensores Industriais
                  </h3>
                  <p className="text-muted-foreground">
                    Receba dados em tempo real de sensores IoT para manutenção preditiva e alertas inteligentes.
                  </p>
                  <Button variant="link" className="pl-0 mt-2">Configurar Dispositivos IoT</Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" /> Plataformas de Gestão Predial
                  </h3>
                  <p className="text-muted-foreground">
                    Integre com sistemas de gestão de edifícios para otimizar a manutenção de infraestruturas.
                  </p>
                  <Button variant="link" className="pl-0 mt-2">Conectar Gestão Predial</Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code className="h-4 w-4" /> APIs para Terceiros
                  </h3>
                  <p className="text-muted-foreground">
                    Utilize nossa API para conectar o FixApp a outras ferramentas e serviços personalizados.
                  </p>
                  <Button variant="link" className="pl-0 mt-2">Documentação da API</Button>
                </div>
              </CardContent>
            </Card>

            {/* Configurações Gerais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" /> Configurações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="text-sm font-medium flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Modo Escuro
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={theme === 'dark'}
                    onCheckedChange={handleThemeChange}
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  Alterne entre o tema claro e escuro para uma melhor experiência visual.
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