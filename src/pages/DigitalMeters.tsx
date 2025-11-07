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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Menu, Gauge, Plus, ArrowLeft, CalendarIcon, Settings2, BellRing, Wrench, CheckCircle2, XCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Meter, MeterReading, AutomationRule } from "@/types/meter"; // Importar os novos tipos

// Mock Data para Ativos (para seleção de medidores)
const mockAssets = [
  { id: "asset1", name: "Ar Condicionado 5TON - 60000 BTU (ac-01)" },
  { id: "asset2", name: "Compressor Principal (comp-02)" },
  { id: "asset3", name: "Painel Solar (ps-01)" },
];

// Mock Data para Medidores
const initialMeters: Meter[] = [
  {
    id: "meter1",
    name: "Temperatura - Ar Condicionado 5TON",
    assetId: "asset1",
    assetName: "Ar Condicionado 5TON - 60000 BTU (ac-01)",
    unit: "C",
    isEnabled: true,
    lastReading: 25,
    lastReadingDate: "2024-11-07T10:00:00Z",
    source: "IoT",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-11-07T10:00:00Z",
  },
  {
    id: "meter2",
    name: "Pressão - Compressor Principal",
    assetId: "asset2",
    assetName: "Compressor Principal (comp-02)",
    unit: "PSI",
    isEnabled: true,
    lastReading: 120,
    lastReadingDate: "2024-11-07T09:30:00Z",
    source: "SCADA",
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-11-07T09:30:00Z",
  },
];

// Mock Data para Leituras de Medidores
const initialMeterReadings: MeterReading[] = [
  { id: "read1", meterId: "meter1", value: 15, timestamp: "2022-12-01T09:28:00Z", source: "IoT", triggeredTaskId: null },
  { id: "read2", meterId: "meter1", value: 32, timestamp: "2022-11-25T01:36:00Z", source: "IoT", triggeredTaskId: "#OS1031" },
  { id: "read3", meterId: "meter2", value: 110, timestamp: "2024-11-06T14:00:00Z", source: "SCADA", triggeredTaskId: null },
  { id: "read4", meterId: "meter1", value: 28, timestamp: "2024-11-07T10:00:00Z", source: "IoT", triggeredTaskId: null },
];

// Mock Data para Regras de Automação
const initialAutomationRules: AutomationRule[] = [
  {
    id: "rule1",
    meterId: "meter1",
    ruleName: "Alerta de Temperatura Alta AC",
    threshold: 30,
    condition: "above",
    actionType: "send_alert",
    actionDetails: "Temperatura do AC acima do limite. Verificar sistema de refrigeração.",
    isEnabled: true,
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "rule2",
    meterId: "meter1",
    ruleName: "OS para Manutenção AC (Crítico)",
    threshold: 35,
    condition: "above",
    actionType: "create_work_order",
    actionDetails: "Criar OS Crítica: Manutenção Urgente no Ar Condicionado (Superaquecimento).",
    isEnabled: true,
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "rule3",
    meterId: "meter2",
    ruleName: "Alerta de Pressão Baixa Compressor",
    threshold: 100,
    condition: "below",
    actionType: "send_alert",
    actionDetails: "Pressão do compressor abaixo do limite. Verificar vazamentos ou falha na bomba.",
    isEnabled: true,
    createdAt: "2024-04-10T00:00:00Z",
  },
];

const DigitalMeters = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [meters, setMeters] = useState<Meter[]>(initialMeters);
  const [meterReadings, setMeterReadings] = useState<MeterReading[]>(initialMeterReadings);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialAutomationRules);

  // Estados para o formulário de nova leitura manual
  const [selectedMeterId, setSelectedMeterId] = useState<string>("");
  const [manualReadingValue, setManualReadingValue] = useState<number | string>("");
  const [readingDate, setReadingDate] = useState<Date | undefined>(undefined);
  const [readingTime, setReadingTime] = useState<string>("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleToggleMeter = (meterId: string, isEnabled: boolean) => {
    setMeters((prev) =>
      prev.map((meter) =>
        meter.id === meterId ? { ...meter, isEnabled, updatedAt: new Date().toISOString() } : meter
      )
    );
    toast.success(`Medidor ${isEnabled ? "habilitado" : "desabilitado"}!`);
  };

  const handleToggleRule = (ruleId: string, isEnabled: boolean) => {
    setAutomationRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, isEnabled } : rule
      )
    );
    toast.success(`Regra de automação ${isEnabled ? "habilitada" : "desabilitada"}!`);
  };

  const handleAddManualReading = () => {
    if (!selectedMeterId || !manualReadingValue || typeof manualReadingValue !== 'number' || manualReadingValue <= 0 || !readingDate || !readingTime) {
      toast.error("Por favor, preencha todos os campos para registrar a leitura.");
      return;
    }

    const selectedMeter = meters.find(m => m.id === selectedMeterId);
    if (!selectedMeter) {
      toast.error("Medidor selecionado inválido.");
      return;
    }

    const dateTimeString = `${format(readingDate, "yyyy-MM-dd")}T${readingTime}:00Z`;
    const newReading: MeterReading = {
      id: `read${Date.now()}`,
      meterId: selectedMeterId,
      value: manualReadingValue,
      timestamp: dateTimeString,
      source: "manual",
      triggeredTaskId: null, // Pode ser atualizado se uma regra for ativada
    };

    setMeterReadings((prev) => [newReading, ...prev]);
    setMeters((prev) =>
      prev.map((meter) =>
        meter.id === selectedMeterId
          ? { ...meter, lastReading: manualReadingValue, lastReadingDate: dateTimeString, updatedAt: new Date().toISOString() }
          : meter
      )
    );
    toast.success("Leitura manual registrada com sucesso!");

    // Resetar formulário
    setSelectedMeterId("");
    setManualReadingValue("");
    setReadingDate(undefined);
    setReadingTime("");

    // Simular verificação de regras de automação
    checkAutomationRules(selectedMeterId, manualReadingValue);
  };

  const checkAutomationRules = (meterId: string, value: number) => {
    const relevantRules = automationRules.filter(rule => rule.meterId === meterId && rule.isEnabled);
    relevantRules.forEach(rule => {
      let conditionMet = false;
      if (rule.condition === "above" && value > rule.threshold) conditionMet = true;
      if (rule.condition === "below" && value < rule.threshold) conditionMet = true;
      if (rule.condition === "equals" && value === rule.threshold) conditionMet = true;

      if (conditionMet) {
        if (rule.actionType === "send_alert") {
          toast.warning(`ALERTA: ${rule.actionDetails}`);
        } else if (rule.actionType === "create_work_order") {
          // Aqui você integraria com a lógica real de criação de OS
          toast.error(`OS AUTOMÁTICA CRIADA: ${rule.actionDetails}`);
          // Atualizar a leitura para indicar que uma OS foi criada
          setMeterReadings(prev => prev.map(r => r.id === `read${Date.now()}` ? { ...r, triggeredTaskId: `#OS${Math.floor(Math.random() * 1000)}` } : r));
        }
      }
    });
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
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
          <h1 className="text-xl font-semibold">Medidores Digitais</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Monitoramento de Medidores</h2>
            <p className="text-muted-foreground">
              Registre leituras, monitore ativos e automatize ações com base em dados de sensores.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            {/* Card: Registrar Leitura Manual */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Registrar Leitura Manual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="meter-select">Medidor</Label>
                    <Select value={selectedMeterId} onValueChange={setSelectedMeterId}>
                      <SelectTrigger id="meter-select">
                        <SelectValue placeholder="Selecione o medidor" />
                      </SelectTrigger>
                      <SelectContent>
                        {meters.map(meter => (
                          <SelectItem key={meter.id} value={meter.id}>
                            {meter.name} ({meter.assetName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reading-value">Valor da Leitura</Label>
                    <Input
                      id="reading-value"
                      type="number"
                      placeholder="Ex: 25.5"
                      value={manualReadingValue}
                      onChange={(e) => setManualReadingValue(parseFloat(e.target.value) || "")}
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="reading-date">Data</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !readingDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {readingDate ? format(readingDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={readingDate}
                            onSelect={setReadingDate}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reading-time">Hora</Label>
                      <Input
                        id="reading-time"
                        type="time"
                        value={readingTime}
                        onChange={(e) => setReadingTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddManualReading}>
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Leitura
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card: Medidores Ativos */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" /> Medidores Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medidor</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead>Última Leitura</TableHead>
                      <TableHead>Fonte</TableHead>
                      <TableHead className="text-right">Habilitado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meters.map((meter) => (
                      <TableRow key={meter.id}>
                        <TableCell className="font-medium">{meter.name}</TableCell>
                        <TableCell>{meter.assetName}</TableCell>
                        <TableCell>
                          {meter.lastReading !== null ? `${meter.lastReading} ${meter.unit}` : "N/A"}
                          {meter.lastReadingDate && <span className="text-muted-foreground text-xs block">{formatDateTime(meter.lastReadingDate)}</span>}
                        </TableCell>
                        <TableCell>{meter.source}</TableCell>
                        <TableCell className="text-right">
                          <Switch
                            checked={meter.isEnabled}
                            onCheckedChange={(checked) => handleToggleMeter(meter.id, checked)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Card: Leituras Recentes */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5" /> Leituras Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medidor</TableHead>
                    <TableHead>Data de Leitura</TableHead>
                    <TableHead>Leitura</TableHead>
                    <TableHead>Ativou Tarefas</TableHead>
                    <TableHead className="text-right">Fonte</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meterReadings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((reading) => {
                    const meter = meters.find(m => m.id === reading.meterId);
                    return (
                      <TableRow key={reading.id}>
                        <TableCell className="font-medium">{meter?.name || reading.meterId}</TableCell>
                        <TableCell>{formatDateTime(reading.timestamp)}</TableCell>
                        <TableCell>{reading.value} {meter?.unit}</TableCell>
                        <TableCell>
                          {reading.triggeredTaskId ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle2 className="h-4 w-4 mr-1" /> Sim ({reading.triggeredTaskId})
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <XCircle className="h-4 w-4 mr-1" /> Não
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{reading.source}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Card: Regras de Automação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" /> Regras de Automação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Regra</TableHead>
                    <TableHead>Medidor</TableHead>
                    <TableHead>Condição</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead className="text-right">Habilitada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automationRules.map((rule) => {
                    const meter = meters.find(m => m.id === rule.meterId);
                    return (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.ruleName}</TableCell>
                        <TableCell>{meter?.name || rule.meterId}</TableCell>
                        <TableCell>
                          {rule.condition === "above" && `Acima de ${rule.threshold} ${meter?.unit}`}
                          {rule.condition === "below" && `Abaixo de ${rule.threshold} ${meter?.unit}`}
                          {rule.condition === "equals" && `Igual a ${rule.threshold} ${meter?.unit}`}
                        </TableCell>
                        <TableCell>
                          {rule.actionType === "create_work_order" && <span className="flex items-center"><Wrench className="h-4 w-4 mr-1" /> Criar OS</span>}
                          {rule.actionType === "send_alert" && <span className="flex items-center"><BellRing className="h-4 w-4 mr-1" /> Enviar Alerta</span>}
                          <span className="block text-muted-foreground text-xs">{rule.actionDetails}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Switch
                            checked={rule.isEnabled}
                            onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

export default DigitalMeters;