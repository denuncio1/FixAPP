export interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string; // Ex: "Gerente de Operações", "Coordenador de Manutenção"
  avatarUrl?: string;
  status: "Ativo" | "Inativo";
}