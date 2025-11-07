"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, Briefcase, Phone, Mail, X } from "lucide-react";
import { toast } from "sonner";
import { Manager } from "@/types/manager"; // Importar a interface Manager
import AppLogo from "@/components/AppLogo"; // Importar AppLogo

const mockRoles = ["Gerente de Operações", "Coordenador de Manutenção", "Supervisor de Equipe", "Administrador"];

const ManagerRegistration = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<"Ativo" | "Inativo">("Ativo");

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !role) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newManager: Manager = {
      id: `mgr${Math.random().toString(36).substr(2, 9)}`, // ID único simples
      name,
      email,
      phone,
      role,
      avatarUrl,
      status,
    };

    console.log("Novo Gestor Cadastrado:", newManager);
    toast.success("Gestor cadastrado com sucesso!");
    // Aqui você integraria com um backend para salvar o gestor
    // Por enquanto, apenas limpamos o formulário e navegamos de volta
    setName("");
    setEmail("");
    setPhone("");
    setRole("");
    setAvatarUrl(undefined);
    setStatus("Ativo");
    navigate("/dashboard"); // Ou para uma lista de gestores
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <AppLogo className="mx-auto mb-4 h-12" /> {/* Adicionar o logo aqui */}
          <div className="mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Avatar do Gestor" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer text-sm text-blue-600 hover:underline mt-2 block text-center"
            >
              Adicionar Foto
            </label>
          </div>
          <CardTitle className="text-2xl font-bold">Cadastro de Gestor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Ana Paula"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="ana.paula@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(41) 99999-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Cargo</Label>
              <Select onValueChange={setRole} value={role}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  {mockRoles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: "Ativo" | "Inativo") => setStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Cadastrar Gestor
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerRegistration;