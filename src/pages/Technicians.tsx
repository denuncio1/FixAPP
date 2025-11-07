"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, Eye } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Technician } from "@/types/technician"; // Importar a interface Technician
import { Menu } from "lucide-react";

// Mock Data para Técnicos (pode ser movido para um contexto ou API real depois)
const mockTechnicians: Technician[] = [
  { id: "tech1", name: "Ana Santos", email: "ana@example.com", phone: "11987654321", address: "Rua A, 123", skills: ["elétrica", "hidráulica"], avatar: "/placeholder.svg", color: "#FF0000", startLat: -23.55052, startLng: -46.633307 },
  { id: "tech2", name: "João Silva", email: "joao@example.com", phone: "11987654322", address: "Rua B, 456", skills: ["refrigeração", "elétrica"], avatar: "/placeholder.svg", color: "#0000FF", startLat: -23.56052, startLng: -46.643307 },
  { id: "tech3", name: "Maria Souza", email: "maria@example.com", phone: "11987654323", address: "Rua C, 789", skills: ["hidráulica"], avatar: "/placeholder.svg", color: "#00FF00", startLat: -23.54052, startLng: -46.623307 },
  { id: "tech4", name: "Pedro Costa", email: "pedro@example.com", phone: "11987654324", address: "Rua D, 101", skills: ["mecânica"], avatar: "/placeholder.svg", color: "#FFA500", startLat: -23.57052, startLng: -46.613307 },
  { id: "tech5", name: "Carla Lima", email: "carla@example.com", phone: "11987654325", address: "Rua E, 202", skills: ["redes"], avatar: "/placeholder.svg", color: "#800080", startLat: -23.53052, startLng: -46.653307 },
];

const Technicians = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredTechnicians = mockTechnicians.filter((tech) =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <h1 className="text-xl font-semibold">Técnicos</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Gerenciar Técnicos</h2>
            <p className="text-muted-foreground">
              Visualize, edite e cadastre técnicos da sua equipe.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, e-mail ou habilidade..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button className="flex items-center gap-2 w-full md:w-auto" onClick={() => navigate("/technicians/new")}>
              <Plus className="h-4 w-4" />
              Novo Técnico
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Técnicos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Habilidades</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTechnicians.length > 0 ? (
                    filteredTechnicians.map((tech) => (
                      <TableRow key={tech.id}>
                        <TableCell className="font-medium">{tech.name}</TableCell>
                        <TableCell>{tech.email}</TableCell>
                        <TableCell>{tech.phone}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {tech.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => console.log("Ver detalhes do técnico:", tech.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                        Nenhum técnico encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Technicians;