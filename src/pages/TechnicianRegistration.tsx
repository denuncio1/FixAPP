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
import { ArrowLeft, User, HardHat, Phone, Mail, MapPin, X } from "lucide-react"; // Adicionado X
import { toast } from "sonner";
import { Technician } from "@/types/technician"; // Importar a interface Technician
import { Badge } from "@/components/ui/badge"; // Adicionado Badge
import AppLogo from "@/components/AppLogo"; // Importar AppLogo

const mockSkills = ["Elétrica", "Hidráulica", "Refrigeração", "Mecânica", "Redes", "Alvenaria"];

const TechnicianRegistration = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const handleSkillChange = (value: string) => {
    if (value && !selectedSkills.includes(value)) {
      setSelectedSkills((prev) => [...prev, value]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

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
    if (!name || !email || !phone || !address || selectedSkills.length === 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newTechnician: Technician = {
      id: `tech${Math.random().toString(36).substr(2, 9)}`, // ID único simples
      name,
      email,
      phone,
      address,
      skills: selectedSkills,
      avatar: avatarUrl,
      color: "#6B7280", // Cor padrão para o técnico
      startLat: -23.55052, // Latitude padrão (ex: centro de São Paulo)
      startLng: -46.633307, // Longitude padrão (ex: centro de São Paulo)
    };

    console.log("Novo Técnico Cadastrado:", newTechnician);
    toast.success("Técnico cadastrado com sucesso!");
    // Aqui você integraria com um backend para salvar o técnico
    // Por enquanto, apenas limpamos o formulário e navegamos de volta
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setSelectedSkills([]);
    setAvatarUrl(undefined);
    navigate("/dashboard"); // Ou para uma lista de técnicos
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
          <AppLogo className="mx-auto mb-4 h-12 w-auto" /> {/* Adicionar o logo aqui */}
          <div className="mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Avatar do Técnico" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <HardHat className="h-12 w-12" />
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
          <CardTitle className="text-2xl font-bold">Cadastro de Técnico</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Fernando Souza"
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
                placeholder="fernando@example.com"
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
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Rua Exemplo, 123, Cidade, Estado"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialty">Especialidade(s)</Label>
              <Select onValueChange={handleSkillChange} value=""> {/* Resetar o valor do select após a seleção */}
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Selecione especialidades" />
                </SelectTrigger>
                <SelectContent>
                  {mockSkills.map((skill) => (
                    <SelectItem key={skill} value={skill} disabled={selectedSkills.includes(skill)}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianRegistration;