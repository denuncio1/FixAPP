export interface Meter {
  id: string;
  name: string; // Ex: "Temperatura - Ar Condicionado 5TON"
  assetId: string; // ID do ativo relacionado
  assetName: string; // Nome do ativo relacionado
  unit: string; // Ex: "C", "PSI", "kWh"
  isEnabled: boolean;
  lastReading: number | null;
  lastReadingDate: string | null; // ISO string
  source: "manual" | "SCADA" | "OPC" | "PLC" | "IoT";
  createdAt: string;
  updatedAt: string;
}

export interface MeterReading {
  id: string;
  meterId: string;
  value: number;
  timestamp: string; // ISO string
  source: "manual" | "SCADA" | "OPC" | "PLC" | "IoT";
  triggeredTaskId?: string | null; // ID da OS/tarefa criada, se houver
}

export interface AutomationRule {
  id: string;
  meterId: string;
  ruleName: string;
  threshold: number;
  condition: "above" | "below" | "equals"; // Ex: "above" (acima de), "below" (abaixo de)
  actionType: "create_work_order" | "send_alert";
  actionDetails: string; // Descrição da ação (ex: "Criar OS para manutenção do AC")
  isEnabled: boolean;
  createdAt: string;
}