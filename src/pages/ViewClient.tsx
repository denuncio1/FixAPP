"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Building, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from "@/types/client"; // Importar a interface Client

const mockClient: Client = {
  id: "client_123",
  code: "CLI001",
  status: "Ativo",
  companyName: "Mercatto Carolliine de Freitas Teixeira Isac LTDA",
  logoUrl: "/public/mercato-logo.png", // Assumindo que você tem um logo mockado aqui
};

const ViewClient = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<Client>(mockClient);
  const [activeTab, setActiveTab] = useState("identificacao");

  // Função para simular o upload de logo (apenas para visualização)
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setClientData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="relative flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="FixApp Logo" className="h-8 w-auto" />
            <div>
              <CardTitle className="text-xl font-bold">Visualizar Cliente</CardTitle>
              <p className="text-sm text-muted-foreground">Informações detalhadas do cliente</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="absolute right-4 top-4"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="identificacao">Identificação</TabsTrigger>
              <TabsTrigger value="localizacao">Localização</TabsTrigger>
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="comercial">Comercial</TabsTrigger>
              <TabsTrigger value="preferencias">Preferências</TabsTrigger>
            </TabsList>
            <TabsContent value="identificacao" className="mt-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 border-2 border-primary/50">
                  <AvatarImage src={clientData.logoUrl || "/placeholder.svg"} alt="Logo do Cliente" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Building className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer text-sm text-blue-600 hover:underline mt-2 block text-center"
                >
                  Adicionar/Alterar Logo
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="grid gap-2">
                  <Label htmlFor="clientCode">Código do Cliente</Label>
                  <Input
                    id="clientCode"
                    value={clientData.code}
                    readOnly
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">Código único para identificação rápida</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={clientData.status} onValueChange={(value) => setClientData(prev => ({ ...prev, status: value as "Ativo" | "Inativo" | "Pendente" }))}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="companyName">Razão Social ou Nome Completo *</Label>
                <Input
                  id="companyName"
                  value={clientData.companyName}
                  readOnly
                  className="bg-muted/50"
                />
              </div>
            </TabsContent>
            <TabsContent value="localizacao" className="mt-6">
              <p className="text-muted-foreground">Conteúdo da aba Localização...</p>
            </TabsContent>
            <TabsContent value="contato" className="mt-6">
              <p className="text-muted-foreground">Conteúdo da aba Contato...</p>
            </TabsContent>
            <TabsContent value="comercial" className="mt-6">
              <p className="text-muted-foreground">Conteúdo da aba Comercial...</p>
            </TabsContent>
            <TabsContent value="preferencias" className="mt-6">
              <p className="text-muted-foreground">Conteúdo da aba Preferências...</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewClient;