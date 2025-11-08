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
  unitCost: number; // NOVO: Custo unitário do material
  isSerialControlled: boolean; // NOVO: Indica se o material é controlado por número de série
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

export interface PurchaseOrderItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  orderDate: string; // ISO string
  expectedDeliveryDate: string; // ISO string
  status: "Pendente" | "Aprovada" | "Recebida Parcialmente" | "Recebida Completa" | "Cancelada";
  createdBy: string;
  notes?: string;
  createdAt: string; // ISO string
}