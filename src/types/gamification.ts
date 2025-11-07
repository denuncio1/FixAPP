export interface GamificationStat {
  id: string;
  technician_id: string;
  points: number;
  rank: number | null;
  medals: string[]; // Array of medal names, e.g., ["Estrela Dourada", "Mestre da Manutenção"]
  last_updated: string;
  created_at: string;
}