"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, UserCog, Lock, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button"; // Importação adicionada

const SecuritySettingsTab: React.FC = () => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);

  const handleBiometricsChange = (checked: boolean) => {
    setBiometricsEnabled(checked);
    toast.info(`Autenticação por Biometria ${checked ? "ativada" : "desativada"}.`);
  };

  const handleTwoFactorAuthChange = (checked: boolean) => {
    setTwoFactorAuthEnabled(checked);
    toast.info(`Autenticação em Dois Fatores ${checked ? "ativada" : "desativada"}.`);
  };

  return (
    <Card className="h-full">
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
  );
};

export default SecuritySettingsTab;