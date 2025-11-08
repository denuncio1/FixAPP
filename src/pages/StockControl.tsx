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
import { Menu, Search, Plus, Boxes, Edit, Trash2, BellRing, ShoppingCart, DollarSign, Package } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Material, PurchaseOrderItem } from "@/types/material";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { Separator } from "@/components/ui/separator"; // Importação adicionada
import { cn } from "@/lib/utils"; // Importação adicionada

// Mock Data para Materiais
const mockMaterials: Material[] = [
  {
    id: "MAT001",
    name: "Filtro de Óleo (Modelo X)",
    code: "FO-MX-001",
    description: "Filtro de óleo para máquinas pesadas.",
    quantity: 8,
    unit: "unidade",
    minStockLevel: 10,
    location: "Armazém Principal, Prateleira A1",
    supplierId: "SUP001",
    lastUpdated: "2024-11-01T10:00:00Z",
    unitCost: 15.00,
    isSerialControlled: false,
  },
  {
    id: "MAT002",
    name: "Cabo Elétrico 2.5mm²",
    code: "CE-2.5-002",
    description: "Cabo de cobre para instalações elétricas.",
    quantity: 200,
    unit: "metro",
    minStockLevel: 50,
    location: "Armazém Principal, Prateleira B2",
    supplierId: "SUP002",
    lastUpdated: "2024-10-30T14:30:00Z",
    unitCost: 2.50,
    isSerialControlled: false,
  },
  {
    id: "MAT003",
    name: "Válvula Hidráulica (Tipo Y)",
    code: "VH-TY-003",
    description: "Válvula de controle para sistemas hidráulicos.",
    quantity: 2,
    unit: "unidade",
    minStockLevel: 3,
    location: "Armazém Principal, Prateleira C3",
    supplierId: "SUP003",
    lastUpdated: "2024-11-02T09:15:00Z",
    unitCost: 80.00,
    isSerialControlled: true,
  },
  {
    id: "MAT004",
    name: "Graxa Lubrificante (Balde 5kg)",
    code: "GL-5KG-004",
    description: "Graxa de alta performance para lubrificação geral.",
    quantity: 1,
    unit: "balde",
    minStockLevel: 1,
    location: "Armazém Principal, Prateleira D4",
    supplierId: "SUP001",
    lastUpdated: "2024-11-01T11:00:00Z",
    unitCost: 120.00,
    isSerialControlled: false,
  },
  {
    id: "MAT005",
    name: "Parafuso M8x20mm",
    code: "PM8X20-005",
    description: "Parafuso de fixação padrão.",
    quantity: 150,
    unit: "unidade",
    minStockLevel: 200,
    location: "Armazém Principal, Gaveta 12",
    supplierId: "SUP004",
    lastUpdated: "2024-10-28T16:00:00Z",
    unitCost: 0.50,
    isSerialControlled: false,
  },
];

// Mock Data para Fornecedores (para seleção no diálogo de OC)
const mockSuppliers: Supplier[] = [
  { id: "SUP001", companyName: "Fornecedor A Ltda", cnpjCpf: "00.000.000/0001-00", status: "Ativo", address: "Rua X", cep: "00000-000", contactName: "Contato A", contactEmail: "a@a.com", contactPhone: "111" },
  { id: "SUP002", companyName: "Fornecedor B S.A.", cnpjCpf: "00.000.000/0001-01", status: "Ativo", address: "Rua Y", cep: "00000-000", contactName: "Contato B", contactEmail: "b@b.com", contactPhone: "222" },
  { id: "SUP003", companyName: "Fornecedor C Ind.", cnpjCpf: "00.000.000/0001-02", status: "Ativo", address: "Rua Z", cep: "00000-000", contactName: "Contato C", contactEmail: "c@c.com", contactPhone: "333" },
];

const StockControl = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [isEnabled, setIsEnabled] = useState(true); // Estado para o toggle "Habilitado"

  // Estados para o diálogo de Nova Ordem de Compra
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

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockMaterials = useMemo(() => {
    return materials.filter(material => material.quantity <= material.minStockLevel);
  }, [materials]);

  const totalStockValue = useMemo(() => {
    return materials.reduce((total, material) => total + (material.quantity * material.unitCost), 0);
  }, [materials]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Funções de CRUD mockadas
  const handleAddMaterial = () => {
    // Lógica para adicionar novo material (abrir um diálogo, etc.)
    console.log("Adicionar novo material");
    // Exemplo: Adicionar um material de teste
    const newMaterial: Material = {
      id: `MAT${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name: "Novo Item de Teste",
      code: `NT-${Math.floor(Math.random() * 1000)}`,
      description: "Descrição do novo item de teste.",
      quantity: 10,
      unit: "unidade",
      minStockLevel: 5,
      location: "Nova Localização",
      lastUpdated: new Date().toISOString(),
      unitCost: 25.00,
      isSerialControlled: false,
    };
    setMaterials((prev) => [...prev, newMaterial]);
    toast.success("Material de teste adicionado!");
  };

  const handleEditMaterial = (id: string) => {
    // Lógica para editar material (abrir um diálogo de edição, etc.)
    console.log("Editar material com ID:", id);
    toast.info(`Editar material com ID: ${id}`);
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este material?")) {
      setMaterials((prev) => prev.filter((material) => material.id !== id));
      toast.success("Material excluído!");
    }
  };

  const handleGeneratePurchaseOrderForLowStock = () => {
    if (lowStockMaterials.length === 0) {
      toast.info("Nenhum material com estoque baixo para gerar ordem de compra.");
      return;
    }

    // Preencher o diálogo de OC com os itens de baixo estoque
    const itemsToOrder: PurchaseOrderItem[] = lowStockMaterials.map(material => ({
      materialId: material.id,
      materialName: material.name,
      quantity: material.minStockLevel * 2 - material.quantity, // Sugestão: pedir o dobro do que falta para atingir o mínimo
      unitCost: material.unitCost,
      totalCost: (material.minStockLevel * 2 - material.quantity) * material.unitCost,
    }));

    setCurrentItems(itemsToOrder);
    setSelectedSupplierId(""); // Resetar fornecedor para que o usuário selecione
    setOrderDate(undefined);
    setExpectedDeliveryDate(undefined);
    setNotes("Ordem de compra gerada automaticamente para itens com baixo estoque.");
    setIsNewOrderDialogOpen(true);
  };

  // Funções para o diálogo de Nova Ordem de Compra (reutilizadas de PurchaseOrders.tsx)
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

    const newOrder = {
      id: `PO${Date.now()}`,
      orderNumber: `OC-${format(new Date(), "yyyyMMdd")}-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      supplierId: selectedSupplierId,
      supplierName: supplier.companyName,
      items: currentItems,
      totalAmount,
      orderDate: orderDate.toISOString(),
      expectedDeliveryDate: expectedDeliveryDate.toISOString(),
      status: "Pendente",
      createdBy: "Usuário Atual (Mock)",
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    };

    // Em um cenário real, esta OC seria enviada para o backend
    console.log("Nova Ordem de Compra criada:", newOrder);
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
    navigate("/stock/purchase-orders"); // Redireciona para a página de OCs
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
          <h1 className="text-xl font-semibold">Controle de Estoque</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Gestão de Peças e Insumos</h2>
            <p className="text-muted-foreground">
              Visualize, adicione e gerencie todos os itens do seu estoque.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Habilitado</CardTitle>
                <Label htmlFor="enabled-mode" className="sr-only">Habilitar/Desabilitar</Label>
                <Switch
                  id="enabled-mode"
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isEnabled ? "Ativo" : "Inativo"}</div>
                <p className="text-xs text-muted-foreground">
                  Status geral do controle de estoque.
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custo Total do Estoque</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalStockValue)}</div>
                <p className="text-xs text-muted-foreground">
                  Valor total de todos os materiais em estoque.
                </p>
              </CardContent>
            </Card>
          </div>

          {lowStockMaterials.length > 0 && (
            <Card className="mb-6 bg-red-50 border-red-200 text-red-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-800">
                  <BellRing className="h-4 w-4" /> Alerta de Estoque Baixo!
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/stock/alerts")}>
                  Ver Detalhes
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {lowStockMaterials.length} item(s) está(ão) abaixo do nível mínimo de estoque.
                  Considere gerar uma ordem de compra.
                </p>
                <Button className="mt-3 w-full" onClick={handleGeneratePurchaseOrderForLowStock}>
                  <ShoppingCart className="h-4 w-4 mr-2" /> Gerar OC para Itens com Baixo Estoque
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, código, descrição ou localização..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button className="flex items-center gap-2 w-full md:w-auto" onClick={handleAddMaterial}>
              <Plus className="h-4 w-4" />
              Novo Material
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Itens em Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead> {/* NOVO */}
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Nível Mínimo</TableHead>
                    <TableHead>Controlado por Serial</TableHead> {/* NOVO */}
                    <TableHead>Localização</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.length > 0 ? (
                    filteredMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.code}</TableCell>
                        <TableCell>{material.description}</TableCell> {/* NOVO */}
                        <TableCell>
                          <Badge
                            className={
                              material.quantity <= material.minStockLevel
                                ? "bg-red-100 text-red-800 hover:bg-red-100/80"
                                : "bg-green-100 text-green-800 hover:bg-green-100/80"
                            }
                          >
                            {material.quantity} {material.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>{material.minStockLevel} {material.unit}</TableCell>
                        <TableCell>{material.isSerialControlled ? "Sim" : "Não"}</TableCell> {/* NOVO */}
                        <TableCell>{material.location}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditMaterial(material.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteMaterial(material.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                        Nenhum material encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Diálogo para Nova Ordem de Compra (reutilizado de PurchaseOrders.tsx) */}
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
          <div className="flex-1 p-4 -mx-4 overflow-y-auto">
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
          </div>
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

export default StockControl;