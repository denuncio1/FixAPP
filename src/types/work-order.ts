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
  status: "Pendente" | "Concluída" | "Crítica" | "Em Andamento"; // Adicionado "Em Andamento"
  client: string;
  title: string;
  description: string;
  technician: string;
  date: string; // Data de criação ou agendamento
  priority: "Baixa" | "Média" | "Crítica";
  daysAgo: number; // Dias desde a criação
  tags: string[]; // Nova propriedade para etiquetas
  startTime?: string; // Horário de início do serviço
  endTime?: string; // Horário de conclusão do serviço
  startLocation?: LocationData; // Localização de início do serviço
  endLocation?: LocationData; // Localização de conclusão do serviço
  activityHistory: ActivityLogEntry[]; // Histórico de atividades
}