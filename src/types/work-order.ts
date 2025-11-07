export interface LocationData {
  lat: number;
  lng: number;
  timestamp: string;
  address?: string; // Opcional, para um endereço legível
}

export interface ActivityLogEntry {
  timestamp: string;
  action: string; // Ex: "Serviço Iniciado", "Serviço Concluído", "OS Criada"
  location?: LocationData;
  details?: string;
}

export interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  notes?: string;
}

export interface ChecklistMedia {
  type: 'image' | 'video';
  url: string; // URL.createObjectURL for client-side, or actual URL from storage
  filename: string;
}

export interface WorkOrderChecklist {
  items: ChecklistItem[];
  photos?: ChecklistMedia[];
  videos?: ChecklistMedia[];
  signatureName?: string; // Para uma assinatura digitada simples
  signatureDate?: string; // ISO string
  completedByTechnicianId?: string;
  completedByTechnicianName?: string;
}

export interface WorkOrder {
  id: string;
  status: "Pendente" | "Concluída" | "Crítica" | "Em Andamento" | "Cancelada" | "Em Verificação";
  client: string;
  title: string;
  description: string;
  technician: string;
  date: string; // Data de criação ou agendamento
  priority: "Baixa" | "Média" | "Crítica" | "Alta";
  classification: "Preventiva" | "Corretiva" | "Preditiva" | "Emergencial";
  daysAgo: number; // Dias desde a criação
  tags: string[];
  startTime?: string; // Horário de início do serviço
  endTime?: string; // Horário de conclusão do serviço
  deadlineDate?: string; // Prazo para conclusão
  startLocation?: LocationData;
  endLocation?: LocationData;
  activityHistory: ActivityLogEntry[];
  address?: string;
  type?: string;
  scheduledTime?: string;
  lat?: number;
  lng?: number;
  requiredSkill?: string;
  checklist?: WorkOrderChecklist; // NOVO CAMPO: Checklist de execução
  assetId?: string; // NOVO CAMPO: ID do ativo relacionado
  assetName?: string; // NOVO CAMPO: Nome do ativo relacionado
  estimatedDuration?: string; // NOVO CAMPO: Duração estimada do serviço
}