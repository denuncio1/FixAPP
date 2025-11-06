export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  skills: string[]; // Pode ser uma lista de especialidades
  avatar?: string; // URL da foto do técnico
  color: string; // Tornada obrigatória
  startLat: number; // Tornada obrigatória
  startLng: number; // Tornada obrigatória
}