export interface AssetActivityLogEntry {
  timestamp: string;
  action: string; // Ex: "Ativo Registrado", "Manutenção Realizada", "Localização Alterada"
  details?: string;
}

export interface Asset {
  id: string;
  name: string;
  code: string; // Código de identificação do ativo
  description?: string;
  status: "Operacional" | "Em Manutenção" | "Inativo";
  locationId: string; // ID da localização onde o ativo está
  purchaseDate?: string; // Data de compra (ISO string)
  lastMaintenanceDate?: string; // Última data de manutenção (ISO string)
  nextMaintenanceDate?: string; // Próxima data de manutenção agendada (ISO string)
  assignedTechnicianId?: string; // ID do técnico responsável pelo ativo
  activityHistory: AssetActivityLogEntry[]; // Histórico de atividades do ativo
  photoUrl?: string; // URL da foto do ativo
}