import { Asset, AssetActivityLogEntry } from "@/types/asset";
import { Location } from "@/types/location";
import { Technician } from "@/types/technician";
import { WorkOrder } from "@/types/work-order";

// Mock Data para Localizações
export const mockLocations: Location[] = [
  { id: "loc1", name: "Filial Centro", address: "Rua A, 123", lat: -23.55052, lng: -46.633307, status: "active" },
  { id: "loc2", name: "Armazém Sul", address: "Av. B, 456", lat: -23.65052, lng: -46.733307, status: "active" },
  { id: "loc3", name: "Escritório Principal", address: "Rua C, 789", lat: -23.50052, lng: -46.603307, status: "active" },
];

// Mock Data para Técnicos
export const mockTechnicians: Technician[] = [
  { id: "tech1", name: "Ana Santos", email: "ana@example.com", phone: "11987654321", address: "Rua A, 123", skills: ["elétrica"], color: "#FF0000", startLat: -23.55052, startLng: -46.633307 },
  { id: "tech2", name: "João Silva", email: "joao@example.com", phone: "11987654322", address: "Rua B, 456", skills: ["refrigeração"], color: "#0000FF", startLat: -23.56052, startLng: -46.643307 },
];

// Mock Data para Ativos
export const mockAssets: Asset[] = [
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

// Mock Data para Ordens de Serviço relacionadas a ativos
export const mockWorkOrders: WorkOrder[] = [
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

// Mock Data para Anexos
export const mockAttachments = [
  { id: "doc1", name: "Manual do Operador MPX-001.pdf", type: "document" as const, url: "/placeholder.svg" },
  { id: "img1", name: "Foto_Instalacao_MPX.jpg", type: "image" as const, url: "/placeholder.svg" },
  { id: "vid1", name: "Video_Calibracao_MPX.mp4", type: "video" as const, url: "/placeholder.svg" },
];

// Mock Data para Leituras de Sensores
export const mockSensorReadings = [
  { id: "sr1", date: "2024-11-06 14:00", type: "Temperatura", value: "24.5 °C" },
  { id: "sr2", date: "2024-11-06 15:00", type: "Umidade", value: "55%" },
  { id: "sr3", date: "2024-11-07 10:00", type: "Pressão", value: "120 PSI" },
];

// Mock Data para Peças Utilizadas
export const mockPartsUsed = [
  { id: "part1", name: "Filtro de Ar HEPA", quantity: 1, unit: "unidade", cost: "R$ 85,00" },
  { id: "part2", name: "Óleo Lubrificante Sintético", quantity: 2, unit: "litros", cost: "R$ 120,00" },
];