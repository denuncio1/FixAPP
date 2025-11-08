"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Users, Lock, Settings as SettingsIcon } from "lucide-react";
import { UserPermissionProfile } from "@/types/user-profile";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Mock Data para Perfis de Permissão
const mockPermissionProfiles: UserPermissionProfile[] = [
  { id: "admin2", description: "Administrador 2do", note: "Grupo de permissão padrão", readOnly: false },
  { id: "admin", description: "Administrador", note: "Grupo de permissão padrão", readOnly: false },
  { id: "clients", description: "Clientes", note: "", readOnly: true },
  { id: "tech_limited", description: "Técnico limitada", note: "Grupo padrão de técnicos com acesso restrito", readOnly: false },
  { id: "fracttal_sergio", description: "PERMISO FRACTTAL HUB_SERGIO", note: "", readOnly: false },
  { id: "supplier", description: "Proveedor de Servicios", note: "", readOnly: false },
  { id: "saica", description: "SAICA", note: "", readOnly: false },
  { id: "sub_contract", description: "Sub_Contrata", note: "", readOnly: false },
  { id: "api_user", description: "USUARIO API", note: "POSTMAN API", readOnly: false },
  { id: "consult_user", description: "Usuario Consulta", note: "", readOnly: true },
  { id: "tech_user", description: "Usuario Tecnico", note: "", readOnly: false },
];

const UserAccountsPermissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState("permissions");
  const [permissionProfiles, setPermissionProfiles] = useState<UserPermissionProfile[]>(mockPermissionProfiles);
  const [isAddProfileDialogOpen, setIsAddProfileDialogOpen] = useState(false);

  // Estados para o formulário de novo perfil
  const [newProfileDescription, setNewProfileDescription] = useState("");
  const [newProfileNote, setNewProfileNote] = useState("");
  const [newProfileReadOnly, setNewProfileReadOnly] = useState(false);

  const handleAddProfile = () => {
    if (!newProfileDescription) {
      toast.error("A descrição do perfil é obrigatória.");
      return;
    }

    const newProfile: UserPermissionProfile = {
      id: `profile${Date.now()}`,
      description: newProfileDescription,
      note: newProfileNote || undefined,
      readOnly: newProfileReadOnly,
    };

    setPermissionProfiles((prev) => [...prev, newProfile]);
    toast.success("Novo perfil de permissão criado com sucesso!");
    setIsAddProfileDialogOpen(false);
    setNewProfileDescription("");
    setNewProfileNote("");
    setNewProfileReadOnly(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> Contas de Usuário e Permissões
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
            <TabsTrigger value="user_accounts">Contas de Usuário</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
          </TabsList>

          <TabsContent value="user_accounts" className="flex-1 p-6">
            <p className="text-muted-foreground">
              Gerencie as contas de usuário individuais aqui. Funcionalidade em desenvolvimento.
            </p>
          </TabsContent>

          <TabsContent value="permissions" className="flex-1 p-6 relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>Solo lectura</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <Checkbox id={`profile-${profile.id}`} />
                    </TableCell>
                    <TableCell className="font-medium">{profile.description}</TableCell>
                    <TableCell>{profile.note || "N/A"}</TableCell>
                    <TableCell>{profile.readOnly ? "Sim" : "Não"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              size="icon"
              className="fixed bottom-6 right-6 rounded-full h-12 w-12 shadow-lg"
              onClick={() => setIsAddProfileDialogOpen(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Diálogo para Adicionar Novo Perfil de Permissão */}
      <Dialog open={isAddProfileDialogOpen} onOpenChange={setIsAddProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> Criar Novo Perfil de Permissão
            </DialogTitle>
            <DialogDescription>
              Defina os detalhes para um novo perfil de permissão de usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                placeholder="Ex: Gerente de Projetos"
                value={newProfileDescription}
                onChange={(e) => setNewProfileDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Nota (Opcional)</Label>
              <Textarea
                id="note"
                placeholder="Detalhes adicionais sobre este perfil..."
                value={newProfileNote}
                onChange={(e) => setNewProfileNote(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="read-only"
                checked={newProfileReadOnly}
                onCheckedChange={setNewProfileReadOnly}
              />
              <Label htmlFor="read-only">Acesso Somente Leitura</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProfileDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddProfile}>
              <Plus className="h-4 w-4 mr-2" /> Criar Perfil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserAccountsPermissions;