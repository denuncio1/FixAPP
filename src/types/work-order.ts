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

export interface WorkOrder {
  id: string;
  status: "Pendente" | "Concluída" | "Crítica" | "Em Andamento" | "Cancelada"; // 'Cancelada' adicionado
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
  deadlineDate?: string; // NOVO CAMPO: Prazo para conclusão
  startLocation?: LocationData;
  endLocation?: LocationData;
  activityHistory: ActivityLogEntry[];
  address?: string;
  type?: string;
  scheduledTime?: string;
  lat?: number;
  lng?: number;
  requiredSkill?: string;
}