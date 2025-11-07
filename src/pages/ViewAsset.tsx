"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, MapPin, User, CalendarCheck, FileText, Clock, Image as ImageIcon, Video, Wrench, Gauge, Boxes, DollarSign, History, Paperclip, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Asset, AssetActivityLogEntry } from "@/types/asset";
import { Location } from "@/types/location";
import { Technician } from "@/types/technician";
import { WorkOrder } from "@/types/work-order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AppLogo from "@/components/AppLogo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adicionado: Importação dos componentes da tabela

// Mock Data (devem ser obtidos de uma API real)
const mockAssets: Asset[] = [
  {
    id: "asset1",
    name: "Máquina de Produção X",
    code: "MPX-001",
    description: "Máquina principal da linha de produção, responsável pela etapa de corte e dobra de materiais metálicos. Possui sistema hidráulico e elétrico complexo.",
    status: "Operacional",
    locationId: "loc1",
    purchaseDate: "2022-01-15T00:00:00Z",
    lastMaintenanceDate: "2024-10-20T00:00:00Z",
    nextMaintenanceDate: "2025-01-20T00:00:00Z",
    assignedTechnicianId: "tech1",
    activityHistory: [
      { timestamp: "2022-01-15T00:00:00Z", action: "Ativo Registrado", details: "Registro inicial do ativo no sistema." },
      { timestamp: "2023-05-20T10:30:00Z", action: "Manutenção Preventiva", details: "Troca de filtros e lubrificação geral." },
      { timestamp: "2024-02-10T14:00:00Z", action: "Reparo Corretivo", details: "Substituição de componente elétrico defeituoso." },
      { timestamp: "2024-10-20T09:00:00Z", action: "Inspeção Periódica", details: "Verificação de segurança e calibração." },
    ],
    photoUrl: "/placeholder.svg",
  },
  {
    id: "asset2",
    name: "Gerador de Energia Principal",
    code: "GEN-001",
    description: "Gerador de backup a diesel para toda a unidade, com capacidade de 500 KVA. Essencial para garantir a continuidade das operações em caso de falha de energia.",
    status: "Em Manutenção",
    locationId: "loc2",
    purchaseDate: "2021-05-10T00:00:00Z",
    lastMaintenanceDate: "2024-09-01T00:00:00Z",
    nextMaintenanceDate: "2024-11-15T00:00:00Z",
    assignedTechnicianId: "tech2",
    activityHistory: [
      { timestamp: "2021-05-10T00:00:00Z", action: "Ativo Registrado", details: "Registro inicial do ativo no sistema." },
      { timestamp: "2023-11-01T08:00:00Z", action: "Manutenção Preventiva", details: "Revisão completa do motor e sistema de combustível." },
      { timestamp: "2024-09-01T11:00:00Z", action: "Reparo Corretivo", details: "Substituição da bateria de partida." },
    ],
    photoUrl: "/placeholder.svg",
  },
  {
    id: "asset3",
    name: "Sistema HVAC Sala Servidor",
    code: "HVAC-003",
    description: "Sistema de climatização dedicado à sala de servidores, garantindo temperatura e umidade ideais para os equipamentos. Monitorado por sensores IoT.",
    status: "Operacional",
    locationId: "loc1",
    purchaseDate: "2023-03-01T00:00:00Z",
    lastMaintenanceDate: "2024-08-10T00:00:00Z",
    nextMaintenanceDate: "2024-11-07T00:00:00Z", // Em atraso
    assignedTechnicianId: "tech1",
    activityHistory: [
      { timestamp: "2023-03-01T00:00:00Z", action: "Ativo Registrado", details: "Registro inicial do ativo no sistema." },
      { timestamp: "2024-08-10T13:00:00Z", action: "Manutenção Preventiva", details: "Limpeza de serpentinas e verificação de gás refrigerante." },
    ],
    photoUrl: "/placeholder.svg",
  },
];

const mockLocations: Location[] = [
  { id: "loc1", name: "Filial Centro", address: "Rua A, 123", lat: -23.55052, lng: -46.633307, status: "active" },
  { id: "loc2", name: "Armazém Sul", address: "Av. B, 456", lat: -23.65052, lng: -46.733307, status: "active" },
];

const mockTechnicians: Technician[] = [
  { id: "tech1", name: "Ana Santos", email: "ana@example.com", phone: "11987654321", address: "Rua A, 123", skills: ["elétrica"], color: "#FF0000", startLat: -23.55052, startLng: -46.633307 },
  { id: "tech2", name: "João Silva", email: "joao@example.com", phone: "11987654322", address: "Rua B, 456", skills: ["refrigeração"], color: "#0000FF", startLat: -23.56052, startLng: -46.643307 },
];

const mockWorkOrders: WorkOrder[] = [
  {
    id: "#OS1017",
    status: "Concluída",
    client: "Mercatto Carolliine de Freitas Teixeira Isac LTDA",
    title: "Reparo na perna da mesa",
    description: "parafusar a perna da mesa que está caindo",
    technician: "Carlos Turibio",
    date: "22/10/2025",
    priority: "Média",
    classification: "Corretiva",
    daysAgo: 14,
    tags: ["mobiliário", "urgente"],
    deadlineDate: "2025-11-05T23:59:59Z",
    activityHistory: [{ timestamp: "2025-10-08T10:00:00Z", action: "OS Criada" }],
    assetId: "asset1", // Relacionado à Máquina de Produção X
    assetName: "Máquina de Produção X",
    estimatedDuration: "1h 30min",
  },
  {
    id: "#OS1020",
    status: "Concluída",
    client: "Empresa ABC Ltda",
    title: "Manutenção preventiva em gerador",
    description: "Troca de óleo e filtros do gerador principal",
    technician: "Nilson Denuncio",
    date: "22/10/2025",
    priority: "Média",
    classification: "Preventiva",
    daysAgo: 15,
    tags: ["elétrica", "preventiva"],
    activityHistory: [{ timestamp: "2025-10-07T08:00:00Z", action: "OS Criada" }],
    assetId: "asset2", // Relacionado ao Gerador de Energia Principal
    assetName: "Gerador de Energia Principal",
    estimatedDuration: "2h 00min",
  },
  {
    id: "#OS1031",
    status: "Em Andamento",
    client: "Filial Centro",
    title: "Verificação de temperatura HVAC",
    description: "Verificar anomalia de temperatura no sistema HVAC da sala de servidores.",
    technician: "Ana Santos",
    date: "07/11/2024",
    priority: "Alta",
    classification: "Preditiva",
    daysAgo: 0,
    tags: ["climatização", "sensor"],
    activityHistory: [{ timestamp: "2024-11-07T10:00:00Z", action: "OS Criada" }],
    assetId: "asset3", // Relacionado ao Sistema HVAC Sala Servidor
    assetName: "Sistema HVAC Sala Servidor",
    estimatedDuration: "1h 00min",
  },
];

const mockAttachments = [
  { id: "doc1", name: "Manual do Operador MPX-001.pdf", type: "document", url: "/placeholder.svg" },
  { id: "img1", name: "Foto_Instalacao_MPX.jpg", type: "image", url: "/placeholder.svg" },
  { id: "vid1", name: "Video_Calibracao_MPX.mp4", type: "video", url: "/placeholder.svg" },
];

const mockSensorReadings = [
  { id: "sr1", date: "2024-11-06 14:00", type: "Temperatura", value: "24.5 °C" },
  { id: "sr2", date: "2024-11-06 15:00", type: "Umidade", value: "55%" },
  { id: "sr3", date: "2024-11-07 10:00", type: "Pressão", value: "120 PSI" },
];

const mockPartsUsed = [
  { id: "part1", name: "Filtro de Ar HEPA", quantity: 1, unit: "unidade", cost: "R$ 85,00" },
  { id: "part2", name: "Óleo Lubrificante Sintético", quantity: 2, unit: "litros", cost: "R$ 120,00" },
];


const ViewAsset = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const foundAsset = mockAssets.find((a) => a.id === id);
    if (foundAsset) {
      setAsset(foundAsset);
    } else {
      // Redirecionar para 404 ou página de ativos se não encontrar
      navigate("/assets");
      // toast.error("Ativo não encontrado.");
    }
  }, [id, navigate]);

  const getLocationName = (locationId?: string) => {
    if (!locationId) return "N/A";
    const location = mockLocations.find(loc => loc.id === locationId);
    return location ? location.name : "Desconhecida";
  };

  const getTechnicianName = (technicianId?: string) => {
    if (!technicianId) return "N/A";
    const technician = mockTechnicians.find(tech => tech.id === technicianId);
    return technician ? technician.name : "Desconhecido";
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    return format(new Date(isoString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const formatDateOnly = (isoString?: string) => {
    if (!isoString) return "N/A";
    return format(new Date(isoString), "dd/MM/yyyy", { locale: ptBR });
  };

  const assetWorkOrders = useMemo(() => {
    return mockWorkOrders.filter(wo => wo.assetId === id);
  }, [id]);

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Carregando detalhes do ativo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-6xl">
        <CardHeader className="relative flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/assets")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <AppLogo className="h-8 w-auto" />
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6" /> {asset.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Código: {asset.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Editar Ativo</Button>
            <Badge
              className={
                asset.status === "Operacional"
                  ? "bg-green-100 text-green-800"
                  : asset.status === "Em Manutenção"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }
            >
              Status: {asset.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="interventions">Histórico de Intervenções</TabsTrigger>
              <TabsTrigger value="attachments">Anexos e Documentos</TabsTrigger>
              <TabsTrigger value="sensors">Sensores e Leituras</TabsTrigger>
              <TabsTrigger value="parts">Peças e Suprimentos</TabsTrigger>
            </TabsList>

            {/* Visão Geral */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Foto do Ativo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={asset.photoUrl || "/placeholder.svg"}
                      alt={asset.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <p className="text-sm text-muted-foreground">{asset.description}</p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Detalhes Principais</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <p><span className="font-medium flex items-center gap-1"><Package className="h-4 w-4" /> Código:</span> {asset.code}</p>
                    <p><span className="font-medium flex items-center gap-1"><MapPin className="h-4 w-4" /> Localização:</span> {getLocationName(asset.locationId)}</p>
                    <p><span className="font-medium flex items-center gap-1"><User className="h-4 w-4" /> Técnico Responsável:</span> {getTechnicianName(asset.assignedTechnicianId)}</p>
                    <p><span className="font-medium flex items-center gap-1"><CalendarCheck className="h-4 w-4" /> Data de Compra:</span> {formatDateOnly(asset.purchaseDate)}</p>
                    <p><span className="font-medium flex items-center gap-1"><Clock className="h-4 w-4" /> Última Manutenção:</span> {formatDateOnly(asset.lastMaintenanceDate)}</p>
                    <p><span className="font-medium flex items-center gap-1"><CalendarCheck className="h-4 w-4" /> Próxima Manutenção:</span> {formatDateOnly(asset.nextMaintenanceDate)}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Histórico de Intervenções */}
            <TabsContent value="interventions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" /> Histórico de Ordens de Serviço
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID da OS</TableHead>
                        <TableHead>Tipo de Tarefa</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Data de Conclusão</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assetWorkOrders.length > 0 ? (
                        assetWorkOrders.map((wo) => (
                          <TableRow key={wo.id}>
                            <TableCell className="font-medium">{wo.id}</TableCell>
                            <TableCell>{wo.classification}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{wo.description}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  wo.status === "Concluída"
                                    ? "bg-green-100 text-green-800"
                                    : wo.status === "Em Andamento"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {wo.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatDateOnly(wo.endTime || wo.date)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                            Nenhuma ordem de serviço encontrada para este ativo.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" /> Log de Atividades do Ativo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] pr-4">
                    <ul className="space-y-3">
                      {asset.activityHistory.length > 0 ? (
                        asset.activityHistory.map((activity, index) => (
                          <li key={index} className="border-l-2 pl-3">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-muted-foreground text-xs">{formatDateTime(activity.timestamp)}</p>
                            {activity.details && <p className="text-muted-foreground text-xs">{activity.details}</p>}
                          </li>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">Nenhuma atividade registrada para este ativo.</p>
                      )}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Anexos e Documentos */}
            <TabsContent value="attachments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5" /> Documentos e Mídias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockAttachments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockAttachments.map((attachment) => (
                        <div key={attachment.id} className="border rounded-md p-3 flex items-center gap-3">
                          {attachment.type === "image" && <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                          {attachment.type === "video" && <Video className="h-6 w-6 text-muted-foreground" />}
                          {attachment.type === "document" && <FileText className="h-6 w-6 text-muted-foreground" />}
                          <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">
                            {attachment.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Nenhum anexo ou documento disponível.</p>
                  )}
                  <Button variant="outline" className="mt-4 w-full">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Anexo
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sensores e Leituras */}
            <TabsContent value="sensors" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" /> Leituras de Sensores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockSensorReadings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead className="text-right">Data/Hora</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockSensorReadings.map((reading) => (
                          <TableRow key={reading.id}>
                            <TableCell>{reading.type}</TableCell>
                            <TableCell>{reading.value}</TableCell>
                            <TableCell className="text-right">{reading.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-sm">Nenhuma leitura de sensor disponível.</p>
                  )}
                  <Button variant="outline" className="mt-4 w-full" onClick={() => navigate("/maintenance/digital-meters")}>
                    <Wrench className="h-4 w-4 mr-2" /> Gerenciar Medidores
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Peças e Suprimentos */}
            <TabsContent value="parts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Boxes className="h-5 w-5" /> Peças e Suprimentos Utilizados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockPartsUsed.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantidade</TableHead>
                          <TableHead>Custo Unitário</TableHead>
                          <TableHead className="text-right">Custo Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockPartsUsed.map((part) => (
                          <TableRow key={part.id}>
                            <TableCell>{part.name}</TableCell>
                            <TableCell>{part.quantity} {part.unit}</TableCell>
                            <TableCell>{part.cost}</TableCell>
                            <TableCell className="text-right">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                parseFloat(part.cost.replace("R$", "").replace(",", ".")) * part.quantity
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-sm">Nenhuma peça ou suprimento registrado para este ativo.</p>
                  )}
                  <Button variant="outline" className="mt-4 w-full" onClick={() => navigate("/stock/control")}>
                    <DollarSign className="h-4 w-4 mr-2" /> Gerenciar Estoque
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewAsset;