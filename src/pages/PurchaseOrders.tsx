"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Menu, Search, Plus, ShoppingCart, CalendarIcon, Truck, Package, DollarSign, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PurchaseOrder, PurchaseOrderItem, Material } from "@/types/material";
import { Supplier } from "@/types/supplier"; // Importar a interface Supplier
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Importação adicionada
import { ScrollArea } from "@/components/ui/scroll-area"; // Importação adicionada
import { Label } from "@/components/ui/label"; // Importação adicionada
import { Textarea } from "@/components/ui/textarea"; // Importação adicionada
import { Separator } from "@/components/ui/separator"; // Importação adicionada

// Mock Data para Fornecedores (para seleção)
const mockSuppliers: Supplier[] = [
  { id: "SUP001", companyName: "Fornecedor A Ltda", cnpjCpf: "00.000.000/0001-00", status: "Ativo", address: "Rua X", cep: "00000-000", contactName: "Contato A", contactEmail: "a@a.com", contactPhone: "111" },
  { id: "SUP002", companyName: "Fornecedor B S.A.", cnpjCpf: "00.000.000/0001-01", status: "Ativo", address: "Rua Y", cep: "00000-000", contactName: "Contato B", contactEmail: "b@b.com", contactPhone: "222" },
];

// Mock Data para Materiais (para seleção de itens da OC)
const mockMaterials: Material[] = [
  { id: "MAT001", name: "Filtro de Óleo (Modelo X)", code: "FO-MX-001", quantity: 50, unit: "unidade", minStockLevel: 10, location: "Armazém Principal, Prateleira A1", lastUpdated: "2024-11-01T10:00:00Z", unitCost: 15.00, isSerialControlled: false },
  { id: "MAT002", name: "Cabo Elétrico 2.5mm²", code: "CE-2.5-002", quantity: 200, unit: "metro", minStockLevel: 50, location: "Armazém Principal, Prateleira B2", lastUpdated: "2024-10-30T14:30:00Z", unitCost: 2.50, isSerialControlled: false },
  { id: "MAT003", name: "Válvula Hidráulica (Tipo Y)", code: "VH-TY-003", quantity: 5, unit: "unidade", minStockLevel: 3, location: "Armazém Principal, Prateleira C3", lastUpdated: "2024-11-02T09:15:00Z", unitCost: 80.00, isSerialControlled: true },
];

// Mock Data para Ordens de Compra
const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO001",
    orderNumber: "OC-2024-001",
    supplierId: "SUP001",
    supplierName: "Fornecedor A Ltda",
    items: [
      { materialId: "MAT001", materialName: "Filtro de Óleo (Modelo X)", quantity: 20, unitCost: 15.00, totalCost: 300.00 },
      { materialId: "MAT002", materialName: "Cabo Elétrico 2.5mm²", quantity: 100, unitCost: 2.50, totalCost: 250.00 },
    ],
    totalAmount: 550.00,
    orderDate: "2024-10-20T10:00:00Z",
    expectedDeliveryDate: "2024-11-05T00:00:00Z",
    status: "Pendente",
    createdBy: "Admin",
    createdAt: "2024-10-20T10:00:00Z",
  },
  {
    id: "PO002",
    orderNumber: "OC-2024-002",
    supplierId: "SUP002",
    supplierName: "Fornecedor B S.A.",
    items: [
      { materialId: "MAT003", materialName: "Válvula Hidráulica (Tipo Y)", quantity: 10, unitCost: 80.00, totalCost: 800.00 },
    ],
    totalAmount: 800.00,
    orderDate: "2024-10-25T14:30:00Z",
    expectedDeliveryDate: "2024-11-10T00:00:00Z",
    status: "Aprovada",
    createdBy: "Manager",
    createdAt: "2024-10-25T14:30:00Z",
  },
];

const PurchaseOrders = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);

  // Estados para o formulário de nova ordem de compra
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [orderDate, setOrderDate] = useState<Date | undefined>(undefined);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [currentItems, setCurrentItems] = useState<PurchaseOrderItem[]>([]);
  const [selectedMaterialForNewItem, setSelectedMaterialForNewItem] = useState<string>("");
  const [quantityForNewItem, setQuantityForNewItem] = useState<number | string>("");
  const [unitCostForNewItem, setUnitCostForNewItem] = useState<number | string>("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredPurchaseOrders = purchaseOrders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.materialName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddItemToOrder = () => {
    if (!selectedMaterialForNewItem || !quantityForNewItem || !unitCostForNewItem) {
      toast.error("Por favor, preencha todos os campos do item.");
      return;
    }
    const material = mockMaterials.find(m => m.id === selectedMaterialForNewItem);
    if (!material) {
      toast.error("Material selecionado inválido.");
      return;
    }

    const quantity = parseFloat(quantityForNewItem as string);
    const unitCost = parseFloat(unitCostForNewItem as string);

    if (isNaN(quantity) || quantity <= 0 || isNaN(unitCost) || unitCost <= 0) {
      toast.error("Quantidade e Custo Unitário devem ser números positivos.");
      return;
    }

    const newItem: PurchaseOrderItem = {
      materialId: material.id,
      materialName: material.name,
      quantity,
      unitCost,
      totalCost: quantity * unitCost,
    };

    setCurrentItems((prev) => [...prev, newItem]);
    setSelectedMaterialForNewItem("");
    setQuantityForNewItem("");
    setUnitCostForNewItem("");
    toast.success("Item adicionado à ordem de compra.");
  };

  const handleRemoveItemFromOrder = (index: number) => {
    setCurrentItems((prev) => prev.filter((_, i) => i !== index));
    toast.info("Item removido da ordem de compra.");
  };

  const handleCreatePurchaseOrder = () => {
    if (!selectedSupplierId || !orderDate || !expectedDeliveryDate || currentItems.length === 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios e adicione pelo menos um item.");
      return;
    }

    const supplier = mockSuppliers.find(s => s.id === selectedSupplierId);
    if (!supplier) {
      toast.error("Fornecedor selecionado inválido.");
      return;
    }

    const totalAmount = currentItems.reduce((sum, item) => sum + item.totalCost, 0);

    const newOrder: PurchaseOrder = {
      id: `PO${Date.now()}`,
      orderNumber: `OC-${format(new Date(), "yyyyMMdd")}-${(purchaseOrders.length + 1).toString().padStart(3, '0')}`,
      supplierId: selectedSupplierId,
      supplierName: supplier.companyName,
      items: currentItems,
      totalAmount,
      orderDate: orderDate.toISOString(),
      expectedDeliveryDate: expectedDeliveryDate.toISOString(),
      status: "Pendente",
      createdBy: "Usuário Atual (Mock)", // Em um app real, seria o usuário logado
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    };

    setPurchaseOrders((prev) => [newOrder, ...prev]);
    toast.success("Ordem de Compra criada com sucesso!");

    // Resetar formulário
    setIsNewOrderDialogOpen(false);
    setSelectedSupplierId("");
    setOrderDate(undefined);
    setExpectedDeliveryDate(undefined);
    setNotes("");
    setCurrentItems([]);
    setSelectedMaterialForNewItem("");
    setQuantityForNewItem("");
    setUnitCostForNewItem("");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Ordens de Compra</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Gerenciar Ordens de Compra</h2>
            <p className="text-muted-foreground">
              Crie, acompanhe e gerencie o processo de aquisição de materiais.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número da OC, fornecedor ou material..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button className="flex items-center gap-2 w-full md:w-auto" onClick={() => setIsNewOrderDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Nova Ordem de Compra
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Ordens de Compra</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº da OC</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Data do Pedido</TableHead>
                    <TableHead>Entrega Prevista</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchaseOrders.length > 0 ? (
                    filteredPurchaseOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.supplierName}</TableCell>
                        <TableCell>{format(new Date(order.orderDate), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                        <TableCell>{format(new Date(order.expectedDeliveryDate), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                        <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                        <TableCell className="text-right">{order.status}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                        Nenhuma ordem de compra encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Diálogo para Nova Ordem de Compra */}
      <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Criar Nova Ordem de Compra
            </DialogTitle>
            <DialogDescription>
              Preencha os detalhes para registrar uma nova ordem de compra.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 p-4 -mx-4">
            <div className="grid gap-4 py-4 px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Fornecedor *</Label>
                  <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Selecione o fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSuppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="orderDate">Data do Pedido *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !orderDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {orderDate ? format(orderDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={orderDate}
                        onSelect={setOrderDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="expectedDeliveryDate">Data de Entrega Prevista *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !expectedDeliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expectedDeliveryDate ? format(expectedDeliveryDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={expectedDeliveryDate}
                        onSelect={setExpectedDeliveryDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Adicionar Itens */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" /> Itens da Ordem de Compra
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="material-item">Material</Label>
                    <Select value={selectedMaterialForNewItem} onValueChange={setSelectedMaterialForNewItem}>
                      <SelectTrigger id="material-item">
                        <SelectValue placeholder="Selecione o material" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockMaterials.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name} ({material.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity-item">Quantidade</Label>
                    <Input
                      id="quantity-item"
                      type="number"
                      placeholder="Ex: 10"
                      value={quantityForNewItem}
                      onChange={(e) => setQuantityForNewItem(parseFloat(e.target.value) || "")}
                      min="1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unitCost-item">Custo Unitário</Label>
                    <Input
                      id="unitCost-item"
                      type="number"
                      placeholder="Ex: 15.50"
                      value={unitCostForNewItem}
                      onChange={(e) => setUnitCostForNewItem(parseFloat(e.target.value) || "")}
                      step="0.01"
                      min="0.01"
                    />
                  </div>
                  <Button onClick={handleAddItemToOrder} className="md:col-span-4">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Item
                  </Button>
                </div>

                {currentItems.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead>Qtd</TableHead>
                        <TableHead>Custo Unit.</TableHead>
                        <TableHead>Custo Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.materialName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                          <TableCell>{formatCurrency(item.totalCost)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItemFromOrder(index)}>
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">Total da Ordem:</TableCell>
                        <TableCell className="font-bold">{formatCurrency(currentItems.reduce((sum, item) => sum + item.totalCost, 0))}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </div>

              <Separator className="my-4" />

              <div className="grid gap-2">
                <Label htmlFor="notes">Notas Adicionais</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações sobre a ordem de compra..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsNewOrderDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreatePurchaseOrder}>
              <ShoppingCart className="h-4 w-4 mr-2" /> Criar Ordem de Compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrders;