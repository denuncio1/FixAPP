"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Menu, Zap, ArrowLeft, CalendarIcon, Plus, History } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EnergyRecord {
  id: string;
  date: string; // ISO string or 'YYYY-MM-DD'
  consumptionKWh: number;
  assetId: string;
  locationId: string;
}

// Mock data for assets and locations (simplified)
const mockAssets = [
  { id: "asset1", name: "Máquina de Produção X" },
  { id: "asset2", name: "Sistema HVAC-01" },
  { id: "asset3", name: "Iluminação Escritório" },
];

const mockLocations = [
  { id: "loc1", name: "Filial Centro" },
  { id: "loc2", name: "Armazém Sul" },
];

const initialEnergyRecords: EnergyRecord[] = [
  { id: "er1", date: "2024-01-01", consumptionKWh: 120, assetId: "asset1", locationId: "loc1" },
  { id: "er2", date: "2024-01-02", consumptionKWh: 130, assetId: "asset1", locationId: "loc1" },
  { id: "er3", date: "2024-01-03", consumptionKWh: 110, assetId: "asset2", locationId: "loc1" },
  { id: "er4", date: "2024-01-04", consumptionKWh: 140, assetId: "asset1", locationId: "loc1" },
  { id: "er5", date: "2024-01-05", consumptionKWh: 90, assetId: "asset3", locationId: "loc2" },
  { id: "er6", date: "2024-01-06", consumptionKWh: 100, assetId: "asset3", locationId: "loc2" },
];

const EnergyConsumption = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [energyRecords, setEnergyRecords] = useState<EnergyRecord[]>(initialEnergyRecords);

  // Form states
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newConsumption, setNewConsumption] = useState<number | string>("");
  const [newAssetId, setNewAssetId] = useState<string>("");
  const [newLocationId, setNewLocationId] = useState<string>("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleAddRecord = () => {
    if (!newDate || !newConsumption || !newAssetId || !newLocationId) {
      toast.error("Por favor, preencha todos os campos para registrar o consumo.");
      return;
    }
    if (typeof newConsumption !== 'number' || newConsumption <= 0) {
      toast.error("O consumo deve ser um número positivo.");
      return;
    }

    const newRecord: EnergyRecord = {
      id: `er${Date.now()}`,
      date: format(newDate, "yyyy-MM-dd"),
      consumptionKWh: newConsumption,
      assetId: newAssetId,
      locationId: newLocationId,
    };

    setEnergyRecords((prev) => [...prev, newRecord].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    toast.success("Registro de consumo adicionado com sucesso!");

    // Reset form
    setNewDate(undefined);
    setNewConsumption("");
    setNewAssetId("");
    setNewLocationId("");
  };

  const chartData = useMemo(() => {
    // Aggregate consumption by date for the chart
    const aggregated: { [key: string]: number } = {};
    energyRecords.forEach(record => {
      if (aggregated[record.date]) {
        aggregated[record.date] += record.consumptionKWh;
      } else {
        aggregated[record.date] = record.consumptionKWh;
      }
    });
    return Object.keys(aggregated).map(date => ({
      date: format(new Date(date), "dd/MM"),
      consumption: aggregated[date],
    })).sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());
  }, [energyRecords]);

  const getAssetName = (id: string) => mockAssets.find(a => a.id === id)?.name || id;
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
          <h1 className="text-xl font-semibold">Consumo Energético</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Monitoramento de Consumo Energético</h2>
            <p className="text-muted-foreground">
              Acompanhe e otimize o consumo de energia em suas operações.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" /> Consumo Total de Energia (KWh)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="consumption" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Registrar Consumo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="consumption-date">Data</Label>
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
                    <Label htmlFor="consumption-kwh">Consumo (KWh)</Label>
                    <Input
                      id="consumption-kwh"
                      type="number"
                      placeholder="Ex: 150.5"
                      value={newConsumption}
                      onChange={(e) => setNewConsumption(parseFloat(e.target.value) || "")}
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="asset-select">Ativo</Label>
                    <Select value={newAssetId} onValueChange={setNewAssetId}>
                      <SelectTrigger id="asset-select">
                        <SelectValue placeholder="Selecione o ativo" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAssets.map(asset => (
                          <SelectItem key={asset.id} value={asset.id}>{asset.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <Button onClick={handleAddRecord}>
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Registro
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" /> Últimos Registros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead className="text-right">KWh</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {energyRecords.slice(-5).reverse().map((record) => ( // Show last 5 records
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>{getAssetName(record.assetId)}</TableCell>
                        <TableCell>{getLocationName(record.locationId)}</TableCell>
                        <TableCell className="text-right">{record.consumptionKWh}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

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

export default EnergyConsumption;