export interface Supplier {
  id: string;
  status: "Ativo" | "Inativo" | "Pendente";
  companyName: string; // Razão Social
  cnpjCpf: string; // CNPJ ou CPF
  logoUrl?: string;
  address: string;
  cep: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  paymentTerms?: string; // Termos de pagamento
  servicesProducts?: string[]; // Lista de serviços/produtos fornecidos
}