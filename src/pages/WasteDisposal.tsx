"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Menu, Trash2, ArrowLeft, CalendarIcon, Plus, Package, History } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface WasteDisposalRecord {
  id: string;
  date: string; // ISO string or 'YYYY-MM-DD'
  wasteType: string;
  quantityKg: number;
  disposalMethod: string; // Ex: "Reciclagem", "Aterro", "Incineracao"
  responsible: string;
  locationId: string;
  notes?: string;
}

// Mock data for waste types and locations
const mockWasteTypes = ["Plástico", "Metal", "Papel", "Orgânico", "Eletrônico", "Químico"];
const mockDisposalMethods = ["Reciclagem", "Aterro Sanitário", "Incineracão", "Reuso"];
const mockLocations = [
  { id: "loc1", name: "Filial Centro" },
  { id: "loc2", name: "Armazém Sul" },
];

const initialWasteRecords: WasteDisposalRecord[] = [
  { id: "wr1", date: "2024-10-25", wasteType: "Plástico", quantityKg: 15, disposalMethod: "Reciclagem", responsible: "João Silva", locationId: "loc1" },
  { id: "wr2", date: "2024-10-25", wasteType: "Orgânico", quantityKg: 20, disposalMethod: "Aterro Sanitário", responsible: "Maria Souza", locationId: "loc1" },
  { id: "wr3", date: "2024-10-26", wasteType: "Metal", quantityKg: 5, disposalMethod: "Reciclagem", responsible: "Pedro Costa", locationId: "loc2" },
  { id: "wr4", date: "2024-10-27", wasteType: "Eletrônico", quantityKg: 2, disposalMethod: "Reciclagem", responsible: "Ana Santos", locationId: "loc1", notes: "Descarte de monitores antigos." },
];

const WasteDisposal = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [wasteRecords, setWasteRecords] = useState<WasteDisposalRecord[]>(initialWasteRecords);

  // Form states
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newWasteType, setNewWasteType] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number | string>("");
  const [newDisposalMethod, setNewDisposalMethod] = useState<string>("");
  const [newResponsible, setNewResponsible] = useState<string>("");
  const [newLocationId, setNewLocationId] = useState<string>("");
  const [newNotes, setNewNotes] = useState<string>("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleAddRecord = () => {
    if (!newDate || !newWasteType || !newQuantity || !newDisposalMethod || !newResponsible || !newLocationId) {
      toast.error("Por favor, preencha todos os campos obrigatórios para registrar o descarte.");
      return;
    }
    if (typeof newQuantity !== 'number' || newQuantity <= 0) {
      toast.error("A quantidade deve ser um número positivo.");
      return;
    }

    const newRecord: WasteDisposalRecord = {
      id: `wr${Date.now()}`,
      date: format(newDate, "yyyy-MM-dd"),
      wasteType: newWasteType,
      quantityKg: newQuantity,
      disposalMethod: newDisposalMethod,
      responsible: newResponsible,
      locationId: newLocationId,
      notes: newNotes || undefined,
    };

    setWasteRecords((prev) => [...prev, newRecord].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast.success("Registro de descarte adicionado com sucesso!");

    // Reset form
    setNewDate(undefined);
    setNewWasteType("");
    setNewQuantity("");
    setNewDisposalMethod("");
    setNewResponsible("");
    setNewLocationId("");
    setNewNotes("");
  };

  const totalWasteKg = useMemo(() => {
    return wasteRecords.reduce((sum, record) => sum + record.quantityKg, 0);
  }, [wasteRecords]);

  const wasteTypeSummary = useMemo(() => {
    const summary: { [key: string]: number } = {};
    wasteRecords.forEach(record => {
      if (summary[record.wasteType]) {
        summary[record.wasteType] += record.quantityKg;
      } else {
        summary[record.wasteType] = record.quantityKg;
      }
    });
    return Object.entries(summary).sort(([, a], [, b]) => b - a);
  }, [wasteRecords]);

  const getLocationName = (id: string) => mockLocations.find(l => l.id === id)?.name || id;

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
          <h1 className="text-xl font-semibold">Descarte de Resíduos</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Gestão de Descarte de Resíduos</h2>
            <p className="text-muted-foreground">
              Gerencie o descarte correto de resíduos gerados pelas operações.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Resíduos Descartados</CardTitle>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWasteKg.toFixed(2)} Kg</div>
                <p className="text-xs text-muted-foreground">Desde o início do registro</p>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" /> Resíduos por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wasteTypeSummary.length > 0 ? (
                  <ul className="space-y-2">
                    {wasteTypeSummary.map(([type, quantity]) => (
                      <li key={type} className="flex justify-between items-center text-sm">
                        <span>{type}</span>
                        <Badge variant="secondary">{quantity.toFixed(2)} Kg</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum resíduo registrado por tipo.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" /> Registrar Novo Descarte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="disposal-date">Data do Descarte</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newDate ? format(newDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newDate}
                        onSelect={setNewDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="waste-type">Tipo de Resíduo</Label>
                  <Select value={newWasteType} onValueChange={setNewWasteType}>
                    <SelectTrigger id="waste-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockWasteTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity-kg">Quantidade (Kg)</Label>
                  <Input
                    id="quantity-kg"
                    type="number"
                    placeholder="Ex: 10.5"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(parseFloat(e.target.value) || "")}
                    step="0.1"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="disposal-method">Método de Descarte</Label>
                  <Select value={newDisposalMethod} onValueChange={setNewDisposalMethod}>
                    <SelectTrigger id="disposal-method">
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDisposalMethods.map(method => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="responsible">Responsável</Label>
                  <Input
                    id="responsible"
                    placeholder="Nome do responsável"
                    value={newResponsible}
                    onChange={(e) => setNewResponsible(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location-select">Localização</Label>
                  <Select value={newLocationId} onValueChange={setNewLocationId}>
                    <SelectTrigger id="location-select">
                      <SelectValue placeholder="Selecione a localização" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLocations.map(location => (
                        <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="notes">Notas Adicionais</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observações sobre o descarte..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  />
                </div>
              </div>
              <Button className="mt-4 w-full" onClick={handleAddRecord}>
                <Plus className="h-4 w-4 mr-2" /> Registrar Descarte
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" /> Histórico de Descartes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade (Kg)</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">Local</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wasteRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{record.wasteType}</TableCell>
                      <TableCell>{record.quantityKg.toFixed(2)}</TableCell>
                      <TableCell>{record.disposalMethod}</TableCell>
                      <TableCell>{record.responsible}</TableCell>
                      <TableCell className="text-right">{getLocationName(record.locationId)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WasteDisposal;