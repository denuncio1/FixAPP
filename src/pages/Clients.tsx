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
import { Plus, Search, Users, Eye, Building } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Client } from "@/types/client"; // Importar a interface Client
import { Menu } from "lucide-react";

// Mock Data para Clientes
const mockClients: Client[] = [
  {
    id: "client_123",
    code: "CLI001",
    status: "Ativo",
    companyName: "Mercatto Carolliine de Freitas Teixeira Isac LTDA",
    logoUrl: "/public/mercato-logo.png",
    address: "Rua da Consolação, 222, Consolação, São Paulo - SP, 01302-000",
    contactName: "João da Silva",
    contactEmail: "joao.silva@mercatto.com",
    contactPhone: "(11) 98765-4321",
  },
  {
    id: "client_124",
    code: "CLI002",
    status: "Pendente",
    companyName: "Tech Solutions S.A.",
    address: "Av. Eng. Luís Carlos Berrini, 1000, Brooklin, São Paulo - SP, 04571-000",
    contactName: "Maria Oliveira",
    contactEmail: "maria.o@techsolutions.com",
    contactPhone: "(11) 99887-6655",
  },
  {
    id: "client_125",
    code: "CLI003",
    status: "Inativo",
    companyName: "Logística Rápida Ltda.",
    address: "Rua Augusta, 500, Consolação, São Paulo - SP, 01304-000",
    contactName: "Pedro Costa",
    contactEmail: "pedro.c@logistica.com",
    contactPhone: "(11) 97766-5544",
  },
  {
    id: "client_126",
    code: "CLI004",
    status: "Ativo",
    companyName: "Indústria Moderna",
    address: "Av. Brasil, 2000, Centro, Campinas - SP, 13010-000",
    contactName: "Ana Souza",
    contactEmail: "ana.s@industriamoderna.com",
    contactPhone: "(19) 98765-1234",
  },
];

const Clients = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredClients = mockClients.filter((client) =>
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-xl font-semibold">Clientes</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Gerenciar Clientes</h2>
            <p className="text-muted-foreground">
              Visualize, edite e cadastre seus clientes.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, código ou contato..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button className="flex items-center gap-2 w-full md:w-auto" onClick={() => navigate("/clients/new")}>
              <Plus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.code}</TableCell>
                        <TableCell>{client.companyName}</TableCell>
                        <TableCell>{client.contactName || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              client.status === "Ativo"
                                ? "bg-green-100 text-green-800 hover:bg-green-100/80"
                                : client.status === "Pendente"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
                                : "bg-red-100 text-red-800 hover:bg-red-100/80"
                            }
                          >
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => console.log("Ver detalhes do cliente:", client.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                        Nenhum cliente encontrado.
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

export default Clients;