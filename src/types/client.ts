export interface Client {
  id: string;
  code: string; // Código do Cliente
  status: "Ativo" | "Inativo" | "Pendente";
  companyName: string; // Razão Social ou Nome Completo
  logoUrl?: string;
  // Campos para as outras abas serão adicionados posteriormente
  address?: string;
  lat?: number;
  lng?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  commercialTerms?: string;
  preferences?: string[];
}