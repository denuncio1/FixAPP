"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Menu, Search, Plus, ListChecks, FileText, CalendarIcon, CheckCircle2, XCircle, History, Download, Upload, PenTool, Signature, Camera, Video, MapPin } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NormaRegulamentadora, NrChecklistItem, NrChecklistRun } from "@/types/nr-checklist";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";

// Mock Data para Normas Regulamentadoras (será substituído por dados do Supabase)
const mockNormas: NormaRegulamentadora[] = [
  { id: "nr10", user_id: "mock_user_id", nr_number: "NR-10", title: "Segurança em Instalações e Serviços em Eletricidade", description: "Estabelece os requisitos e condições mínimas objetivando a implementação de medidas de controle e sistemas preventivos, de forma a garantir a segurança e a saúde dos trabalhadores que, direta ou indiretamente, interajam em instalações elétricas e serviços com eletricidade.", content_url: "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/seguranca-e-saude-no-trabalho/normatizacao/normas-regulamentadoras/nr-10.pdf", created_at: "2023-01-01T00:00:00Z" },
  { id: "nr12", user_id: "mock_user_id", nr_number: "NR-12", title: "Segurança no Trabalho em Máquinas e Equipamentos", description: "Define referências técnicas, princípios fundamentais e medidas de proteção para garantir a saúde e a integridade física dos trabalhadores e estabelece requisitos mínimos para a prevenção de acidentes e doenças do trabalho nas fases de projeto e de utilização de máquinas e equipamentos de todos os tipos.", content_url: "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/seguranca-e-saude-no-trabalho/normatizacao/normas-regulamentadoras/nr-12.pdf", created_at: "2023-01-01T00:00:00Z" },
  { id: "osha1910", user_id: "mock_user_id", nr_number: "OSHA 1910.147", title: "The Control of Hazardous Energy (Lockout/Tagout)", description: "This standard addresses the practices and procedures necessary to disable machinery or equipment to prevent the release of hazardous energy while employees perform servicing and maintenance activities.", content_url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147", created_at: "2023-01-01T00:00:00Z" },
];

// Mock Data para Itens de Checklist (será substituído por dados do Supabase)
const mockNrChecklistItems: NrChecklistItem[] = [
  { id: "nr10-1", user_id: "mock_user_id", nr_number: "NR-10", item_description: "10.2.1.1 - Medidas de controle do risco elétrico", is_header: true, created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
  { id: "nr10-2", user_id: "mock_user_id", nr_number: "NR-10", item_description: "Os trabalhadores autorizados possuem treinamento específico e reciclagem em dia?", guidance: "Verificar certificados de treinamento e validade.", created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
  { id: "nr10-3", user_id: "mock_user_id", nr_number: "NR-10", item_description: "Os equipamentos de proteção individual (EPIs) estão sendo utilizados corretamente e estão em bom estado?", guidance: "Inspecionar EPIs (luvas, óculos, capacete, calçado de segurança).", created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
  { id: "nr10-4", user_id: "mock_user_id", nr_number: "NR-10", item_description: "Existe sinalização de segurança adequada nas áreas de serviço elétrico?", guidance: "Verificar placas de advertência, isolamento de área.", created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
  { id: "nr12-1", user_id: "mock_user_id", nr_number: "NR-12", item_description: "12.4.1 - Sistemas de segurança", is_header: true, created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
  { id: "nr12-2", user_id: "mock_user_id", nr_number: "NR-12", item_description: "As máquinas e equipamentos possuem sistemas de segurança (ex: proteções fixas, móveis, intertravamento) conforme a norma?", guidance: "Inspecionar proteções físicas e dispositivos de segurança.", created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
  { id: "nr12-3", user_id: "mock_user_id", nr_number: "NR-12", item_description: "Os dispositivos de parada de emergência estão acessíveis e funcionando?", guidance: "Testar botões de emergência.", created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
];

// Mock Data para Execuções de Checklist (será substituído por dados do Supabase)
const mockNrChecklistRuns: NrChecklistRun[] = [
  { id: "run1", user_id: "mock_user_id", nr_number: "NR-10", completion_date: "2024-10-20T10:00:00Z", compliance_percentage: 85.0, total_items: 3, compliant_items: 2, non_compliant_items: 1, notes: "Item 10.2.1.1.3 (aterramento) não conforme.", created_at: "2024-10-20T10:00:00Z" },
  { id: "run2", user_id: "mock_user_id", nr_number: "NR-12", completion_date: "2024-10-25T14:30:00Z", compliance_percentage: 100.0, total_items: 2, compliant_items: 2, non_compliant_items: 0, notes: "Todas as proteções e emergências verificadas.", created_at: "2024-10-25T14:30:00Z" },
];

interface LocationData {
  lat: number;
  lng: number;
  timestamp: string;
  address?: string;
}

interface ChecklistMedia {
  type: 'image' | 'video';
  url: string;
  filename: string;
}

const NRChecklist = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNr, setSelectedNr] = useState<string | null>(null);
  const [normas, setNormas] = useState<NormaRegulamentadora[]>(mockNormas);
  const [checklistItems, setChecklistItems] = useState<NrChecklistItem[]>([]);
  const [checklistRuns, setChecklistRuns] = useState<NrChecklistRun[]>(mockNrChecklistRuns);
  const { user } = useSession();

  // Estados para a execução do checklist
  const [currentRunItems, setCurrentRunItems] = useState<NrChecklistItem[]>([]);
  const [runNotes, setRunNotes] = useState("");
  const [runPhotos, setRunPhotos] = useState<ChecklistMedia[]>([]);
  const [runVideos, setRunVideos] = useState<ChecklistMedia[]>([]);
  const [signatureName, setSignatureName] = useState("");
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    // Simular carregamento de itens de checklist para a NR selecionada
    if (selectedNr) {
      const items = mockNrChecklistItems.filter(item => item.nr_number === selectedNr);
      setCurrentRunItems(items.map(item => ({ ...item, is_compliant: undefined, notes: undefined }))); // Resetar status para nova execução
    } else {
      setCurrentRunItems([]);
    }
  }, [selectedNr]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredNormas = normas.filter((norma) =>
    norma.nr_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    norma.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    norma.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemComplianceChange = (id: string, compliant: boolean) => {
    setCurrentRunItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_compliant: compliant } : item)),
    );
  };

  const handleItemNotesChange = (id: string, notes: string) => {
    setCurrentRunItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item)),
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos: ChecklistMedia[] = Array.from(event.target.files).map((file) => ({
        type: "image",
        url: URL.createObjectURL(file),
        filename: file.name,
      }));
      setRunPhotos((prev) => [...prev, ...newPhotos]);
      toast.success(`${newPhotos.length} foto(s) adicionada(s).`);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newVideos: ChecklistMedia[] = Array.from(event.target.files).map((file) => ({
        type: "video",
        url: URL.createObjectURL(file),
        filename: file.name,
      }));
      setRunVideos((prev) => [...prev, ...newVideos]);
      toast.success(`${newVideos.length} vídeo(s) adicionado(s).`);
    }
  };

  const handleRemoveMedia = (urlToRemove: string) => {
    setRunPhotos((prev) => prev.filter((media) => media.url !== urlToRemove));
    setRunVideos((prev) => prev.filter((media) => media.url !== urlToRemove));
    URL.revokeObjectURL(urlToRemove);
    toast.info("Mídia removida.");
  };

  const getLocation = async () => {
    return new Promise<LocationData | null>((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const timestamp = new Date().toISOString();
            let address = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

            // Try to get a readable address
            if (window.google && window.google.maps.Geocoder) {
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                  address = results[0].formatted_address;
                }
                resolve({ lat, lng, timestamp, address });
              });
            } else {
              resolve({ lat, lng, timestamp, address });
            }
          },
          (error) => {
            console.error("Erro ao obter localização:", error);
            toast.warning("Não foi possível obter a localização atual. Usando localização simulada.");
            resolve({
              lat: -23.55052,
              lng: -46.633307,
              timestamp: new Date().toISOString(),
              address: "Localização Simulada (São Paulo)",
            });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        toast.warning("Geolocalização não suportada pelo navegador. Usando localização simulada.");
        resolve({
          lat: -23.55052,
          lng: -46.633307,
          timestamp: new Date().toISOString(),
          address: "Localização Simulada (São Paulo)",
        });
      }
    });
  };

  const handleGetLocation = async () => {
    const loc = await getLocation();
    setCurrentLocation(loc);
    if (loc) {
      toast.success("Localização atual obtida!");
    }
  };

  const handleCompleteChecklist = async () => {
    if (!selectedNr) {
      toast.error("Por favor, selecione uma normativa para o checklist.");
      return;
    }
    if (currentRunItems.some(item => !item.is_header && item.is_compliant === undefined)) {
      toast.error("Todos os itens do checklist devem ser marcados como 'Conforme' ou 'Não Conforme'.");
      return;
    }
    if (!signatureName) {
      toast.error("Por favor, insira seu nome para a assinatura digital.");
      return;
    }
    if (!currentLocation) {
      toast.error("Por favor, obtenha a localização antes de concluir o checklist.");
      return;
    }

    const totalItems = currentRunItems.filter(item => !item.is_header).length;
    const compliantItems = currentRunItems.filter(item => !item.is_header && item.is_compliant).length;
    const nonCompliantItems = totalItems - compliantItems;
    const compliancePercentage = totalItems > 0 ? (compliantItems / totalItems) * 100 : 100;

    const newRun: NrChecklistRun = {
      id: `run${Date.now()}`,
      user_id: user?.id || "anonymous",
      nr_number: selectedNr,
      completion_date: new Date().toISOString(),
      compliance_percentage: parseFloat(compliancePercentage.toFixed(1)),
      total_items: totalItems,
      compliant_items: compliantItems,
      non_compliant_items: nonCompliantItems,
      notes: runNotes,
      created_at: new Date().toISOString(),
    };

    // Aqui você enviaria newRun, runPhotos, runVideos, signatureName, currentLocation para o backend
    console.log("Checklist Concluído:", newRun);
    console.log("Fotos:", runPhotos);
    console.log("Vídeos:", runVideos);
    console.log("Assinatura:", signatureName);
    console.log("Localização:", currentLocation);

    setChecklistRuns((prev) => [newRun, ...prev]);
    toast.success("Checklist concluído e registrado com sucesso!");

    // Resetar estados
    setRunNotes("");
    setRunPhotos([]);
    setRunVideos([]);
    setSignatureName("");
    setCurrentLocation(null);
    setSelectedNr(null); // Volta para a seleção de NR
  };

  const getNrTitle = (nrNumber: string) => {
    return normas.find(n => n.nr_number === nrNumber)?.title || nrNumber;
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
          <h1 className="text-xl font-semibold">Checklist de Normativas</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Gerenciar e Executar Checklists de Conformidade</h2>
            <p className="text-muted-foreground">
              Garanta o cumprimento de normativas como OSHA, NR's e EPA, registrando informações detalhadas.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            {/* Card de Seleção de Normativa e Execução */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5" /> Selecionar Normativa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nr-select">Normativa</Label>
                    <Select value={selectedNr || ""} onValueChange={setSelectedNr}>
                      <SelectTrigger id="nr-select">
                        <SelectValue placeholder="Selecione uma normativa" />
                      </SelectTrigger>
                      <SelectContent>
                        {normas.map((nr) => (
                          <SelectItem key={nr.id} value={nr.nr_number}>
                            {nr.nr_number} - {nr.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedNr && (
                    <>
                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> Adicionar Nova Normativa
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" /> Importar Itens de Checklist
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" /> Exportar Itens de Checklist
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card de Itens do Checklist para Execução */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" /> Executar Checklist: {selectedNr ? getNrTitle(selectedNr) : "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedNr ? (
                  <div className="grid gap-4">
                    <div className="max-h-[300px] overflow-y-auto pr-4">
                      {currentRunItems.length > 0 ? (
                        currentRunItems.map((item) => (
                          <div key={item.id} className={cn("mb-4", item.is_header ? "font-semibold text-md mt-4" : "border-b pb-3")}>
                            <div className="flex items-center space-x-2 mb-2">
                              {!item.is_header && (
                                <>
                                  <Checkbox
                                    id={`item-${item.id}-compliant`}
                                    checked={item.is_compliant === true}
                                    onCheckedChange={(checked) => handleItemComplianceChange(item.id, !!checked)}
                                  />
                                  <Label htmlFor={`item-${item.id}-compliant`} className="text-sm font-medium leading-none">
                                    {item.item_description}
                                  </Label>
                                  {item.is_compliant === false && <XCircle className="h-4 w-4 text-red-500 ml-2" />}
                                  {item.is_compliant === true && <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />}
                                </>
                              )}
                              {item.is_header && <span className="text-base">{item.item_description}</span>}
                            </div>
                            {!item.is_header && item.guidance && (
                              <p className="text-xs text-muted-foreground ml-6 mb-2">
                                <span className="font-medium">Orientação:</span> {item.guidance}
                              </p>
                            )}
                            {!item.is_header && (
                              <Textarea
                                placeholder="Notas sobre este item..."
                                value={item.notes || ""}
                                onChange={(e) => handleItemNotesChange(item.id, e.target.value)}
                                className="ml-6 mt-1 text-sm"
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          Nenhum item de checklist disponível para esta normativa.
                        </p>
                      )}
                    </div>

                    {/* Mídias */}
                    <div className="grid gap-2 mt-4">
                      <Label htmlFor="photo-upload" className="flex items-center gap-2">
                        <Camera className="h-4 w-4" /> Fotos
                      </Label>
                      <Input id="photo-upload" type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
                      <div className="grid grid-cols-3 gap-2">
                        {runPhotos.map((media) => (
                          <div key={media.url} className="relative group">
                            <img src={media.url} alt={media.filename} className="h-20 w-full object-cover rounded-md border" />
                            <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveMedia(media.url)}>
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="video-upload" className="flex items-center gap-2">
                        <Video className="h-4 w-4" /> Vídeos
                      </Label>
                      <Input id="video-upload" type="file" accept="video/*" multiple onChange={handleVideoUpload} />
                      <div className="grid grid-cols-3 gap-2">
                        {runVideos.map((media) => (
                          <div key={media.url} className="relative group">
                            <video src={media.url} controls className="h-20 w-full object-cover rounded-md border" />
                            <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveMedia(media.url)}>
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notas Gerais */}
                    <div className="grid gap-2">
                      <Label htmlFor="run-notes">Notas Gerais</Label>
                      <Textarea
                        id="run-notes"
                        placeholder="Observações adicionais sobre a execução do checklist..."
                        value={runNotes}
                        onChange={(e) => setRunNotes(e.target.value)}
                      />
                    </div>

                    {/* Localização e Assinatura */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="signature-name" className="flex items-center gap-2">
                          <Signature className="h-4 w-4" /> Assinatura Digital
                        </Label>
                        <Input
                          id="signature-name"
                          placeholder="Seu Nome Completo"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location-info" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Localização
                        </Label>
                        <Button type="button" variant="outline" onClick={handleGetLocation}>
                          {currentLocation ? "Localização Obtida" : "Obter Localização Atual"}
                        </Button>
                        {currentLocation && (
                          <p className="text-xs text-muted-foreground break-words">
                            {currentLocation.address || `Lat: ${currentLocation.lat.toFixed(4)}, Lng: ${currentLocation.lng.toFixed(4)}`}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button onClick={handleCompleteChecklist} className="w-full mt-4">
                      <ListChecks className="h-4 w-4 mr-2" /> Concluir Checklist
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Selecione uma normativa para iniciar a execução do checklist.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Histórico de Execuções de Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" /> Histórico de Execuções de Checklists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Normativa</TableHead>
                    <TableHead>Data de Conclusão</TableHead>
                    <TableHead>Itens Conformes</TableHead>
                    <TableHead>Itens Não Conformes</TableHead>
                    <TableHead className="text-right">Conformidade (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checklistRuns.length > 0 ? (
                    checklistRuns.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell className="font-medium">{run.nr_number}</TableCell>
                        <TableCell>{format(new Date(run.completion_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                        <TableCell>{run.compliant_items}</TableCell>
                        <TableCell>{run.non_compliant_items}</TableCell>
                        <TableCell className="text-right">{run.compliance_percentage.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                        Nenhuma execução de checklist registrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default NRChecklist;