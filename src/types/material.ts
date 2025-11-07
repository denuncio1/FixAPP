export interface Material {
  id: string;
  name: string;
  code: string; // Código do item (SKU)
  description?: string;
  quantity: number;
  unit: string; // Ex: "unidade", "metro", "litro", "kg"
  minStockLevel: number; // Nível mínimo para alerta de estoque
  location: string; // Localização no estoque (ex: "Prateleira A1", "Armazém Principal")
  supplierId?: string; // ID do fornecedor principal
  lastUpdated: string; // Data da última atualização (ISO string)
}

export interface MaterialMovement {
  id: string;
  materialId: string;
  materialName: string;
  type: "Entrada" | "Saída";
  quantity: number;
  timestamp: string; // Data e hora da movimentação
  responsible: string; // Quem realizou a movimentação
  reason: string; // Motivo da movimentação (ex: "Compra", "Uso em OS #123", "Devolução")
}

export interface LowStockAlert {
  id: string;
  materialId: string;
  materialName: string;
  currentQuantity: number;
  minStockLevel: number;
  timestamp: string; // Data e hora do alerta
  status: "Ativo" | "Resolvido";
}