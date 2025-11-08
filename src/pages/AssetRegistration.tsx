"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; // Importar locale para português
import { ArrowLeft, Package, CalendarIcon, MapPin, User, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Asset } from "@/types/asset"; // Importar a interface Asset
import { Location } from "@/types/location"; // Importar a interface Location
import { Technician } from "@/types/technician"; // Importar a interface Technician
import { cn } from "@/lib/utils";
import AppLogo from "@/components/AppLogo"; // Importar AppLogo

// Mock Data para Localizações e Técnicos
const mockLocations: Location[] = [
  { id: "loc1", name: "Filial Centro", address: "Rua A, 123", lat: -23.55052, lng: -46.633307, status: "active" },
  { id: "loc2", name: "Armazém Sul", address: "Av. B, 456", lat: -23.65052, lng: -46.733307, status: "active" },
  { id: "loc3", name: "Escritório Principal", address: "Rua C, 789", lat: -23.50052, lng: -46.603307, status: "active" },
];

const mockTechnicians: Technician[] = [
  { id: "tech1", name: "Ana Santos", email: "ana@example.com", phone: "11987654321", address: "Rua A, 123", skills: ["elétrica"], color: "#FF0000", startLat: -23.55052, startLng: -46.633307 },
  { id: "tech2", name: "João Silva", email: "joao@example.com", phone: "11987654322", address: "Rua B, 456", skills: ["refrigeração"], color: "#0000FF", startLat: -23.56052, startLng: -46.643307 },
];

const AssetRegistration = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Operacional" | "Em Manutenção" | "Inativo">("Operacional");
  const [locationId, setLocationId] = useState<string | undefined>(undefined);
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(undefined);
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState<Date | undefined>(undefined);
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState<Date | undefined>(undefined);
  const [assignedTechnicianId, setAssignedTechnicianId] = useState<string | undefined>(undefined);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | undefined>(undefined);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPhotoFile(file);
      setPhotoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !locationId) {
      toast.error("Por favor, preencha os campos obrigatórios: Nome, Código e Localização.");
      return;
    }

    const newAsset: Asset = {
      id: `asset${Math.random().toString(36).substr(2, 9)}`,
      name,
      code,
      description: description || undefined,
      status,
      locationId,
      purchaseDate: purchaseDate ? purchaseDate.toISOString() : undefined,
      lastMaintenanceDate: lastMaintenanceDate ? lastMaintenanceDate.toISOString() : undefined,
      nextMaintenanceDate: nextMaintenanceDate ? nextMaintenanceDate.toISOString() : undefined,
      assignedTechnicianId: assignedTechnicianId || undefined,
      activityHistory: [{
        timestamp: new Date().toISOString(),
        action: "Ativo Registrado",
        details: `Ativo ${name} (${code}) registrado.`,
      }],
      photoUrl: photoPreviewUrl,
    };

    console.log("Novo Ativo Cadastrado:", newAsset);
    toast.success("Ativo cadastrado com sucesso!");
    // Aqui você integraria com um backend para salvar o ativo
    // Por enquanto, apenas limpamos o formulário e navegamos para a página de detalhes do novo ativo
    setName("");
    setCode("");
    setDescription("");
    setStatus("Operacional");
    setLocationId(undefined);
    setPurchaseDate(undefined);
    setLastMaintenanceDate(undefined);
    setNextMaintenanceDate(undefined);
    setAssignedTechnicianId(undefined);
    setPhotoFile(null);
    setPhotoPreviewUrl(undefined);
    navigate(`/assets/${newAsset.id}`); // Redireciona para a página de detalhes do ativo
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
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
          <CardTitle className="text-2xl font-bold">Cadastro de Ativo</CardTitle>
          <p className="text-sm text-muted-foreground">Registre novos equipamentos e ativos para manutenção.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Ativo *</Label>
                <Input
                  id="name"
                  placeholder="Máquina de Produção X"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Código do Ativo *</Label>
                <Input
                  id="code"
                  placeholder="MPX-001"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Detalhes sobre o ativo, função, especificações..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Status e Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={status} onValueChange={(value: "Operacional" | "Em Manutenção" | "Inativo") => setStatus(value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operacional">Operacional</SelectItem>
                    <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Localização *</Label>
                <Select value={locationId} onValueChange={setLocationId}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Selecione a localização" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLocations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" /> {loc.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="purchaseDate">Data de Compra</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !purchaseDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {purchaseDate ? format(purchaseDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={purchaseDate}
                      onSelect={setPurchaseDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastMaintenanceDate">Última Manutenção</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !lastMaintenanceDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {lastMaintenanceDate ? format(lastMaintenanceDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={lastMaintenanceDate}
                      onSelect={setLastMaintenanceDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nextMaintenanceDate">Próxima Manutenção</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !nextMaintenanceDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {nextMaintenanceDate ? format(nextMaintenanceDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={nextMaintenanceDate}
                      onSelect={setNextMaintenanceDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Técnico Responsável e Foto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="assignedTechnician">Técnico Responsável</Label>
                <Select value={assignedTechnicianId} onValueChange={setAssignedTechnicianId}>
                  <SelectTrigger id="assignedTechnician">
                    <SelectValue placeholder="Selecione um técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTechnicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" /> {tech.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photo">Foto do Ativo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                {photoPreviewUrl && (
                  <img src={photoPreviewUrl} alt="Pré-visualização da foto" className="mt-2 h-24 w-auto object-cover rounded-md" />
                )}
              </div>
            </div>

            {/* Botão de Cadastro */}
            <Button type="submit" className="w-full">
              <Package className="h-4 w-4 mr-2" /> Cadastrar Ativo
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetRegistration;