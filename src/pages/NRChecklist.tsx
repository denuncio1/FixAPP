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
import { Menu, Search, Plus, ListChecks, FileText, CalendarIcon, CheckCircle2, XCircle, History, Download, Upload, PenTool, Signature, Camera, Video, MapPin, Wrench } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NormaRegulamentadora, NrChecklistItem, NrChecklistRun } from "@/types/nr-checklist";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import NewWorkRequestDialog from "@/components/NewWorkRequestDialog"; // Importar o novo diálogo de solicitação de trabalho
import { WorkRequest, ChecklistMedia } from "@/types/work-order"; // Importar tipos necessários

// Importar os novos componentes modulares
import NRChecklistSelection from "@/components/nr-checklist/NRChecklistSelection.tsx";
import NRChecklistExecution from "@/components/nr-checklist/NRChecklistExecution.tsx";
import NRChecklistHistory from "@/components/nr-checklist/NRChecklistHistory.tsx";

// Mock Data para Normas Regulamentadoras (será substituído por dados do Supabase)
const mockNormas: NormaRegulamentadora[] = [
  { id: "nr10", user_id: "mock_user_id", nr_number: "NR-10", title: "Segurança em Instalações e Serviços em Eletricidade", description: "Estabelece os requisitos e condições mínimas objetivando a implementação de medidas de controle e sistemas preventivos, de forma a garantir a segurança e a saúde dos trabalhadores que, direta ou indiretamente, interajam em instalações elétricas e serviços com eletricidade.", content_url: "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/seguranca-e-saude-no-trabalho/normatizacao/normas-regulamentadoras/nr-10.pdf", created_at: "2023-01-01T00:00:00Z" },
  { id: "nr12", user_id: "mock_user_id", nr_number: "NR-12", title: "Segurança no Trabalho em Máquinas e Equipamentos", description: "Define referências técnicas, princípios fundamentais e medidas de proteção para garantir a saúde e a integridade física dos trabalhadores e estabelece requisitos mínimos para a prevenção de acidentes e doenças do trabalho nas fases de projeto e de utilização de máquinas e equipamentos de todos os tipos.", content_url: "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/seguranca-e-saude-no-trabalho/normatizacao/normas-regulamentadoras/nr-12.pdf", created_at: "2023-01-01T00:00:00Z" },
  { id: "osha1910", user_id: "mock_user_id", nr_number: "OSHA 1910.147", title: "The Control of Hazardous Energy (Lockout/Tagout)", description: "This standard addresses the practices and procedures necessary to disable machinery or equipment to prevent the release of hazardous energy while employees perform servicing and maintenance activities.", content_url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147", created_at: "2023-01-01T00:00:00Z" },
  { id: "epa", user_id: "mock_user_id", nr_number: "EPA", title: "Environmental Protection Agency Regulations", description: "Regulations set by the U.S. Environmental Protection Agency to protect human health and the environment.", content_url: "https://www.epa.gov/laws-regs/regulations", created_at: "2023-01-01T00:00:00Z" },
  { id: "iso50001", user_id: "mock_user_id", nr_number: "ISO 50001", title: "Energy Management Systems", description: "International standard for energy management systems (EnMS) to help organizations improve their energy performance.", content_url: "https://www.iso.org/standard/69501.html", created_at: "2023-01-01T00:00:00Z" },
  { id: "iso45001", user_id: "mock_user_id", nr_number: "ISO 45001", title: "Occupational Health and Safety Management Systems", description: "International standard for occupational health and safety (OH&S) management systems, providing a framework to improve employee safety, reduce workplace risks and create better, safer working conditions.", content_url: "https://www.iso.org/standard/65460.html", created_at: "2023-01-01T00:00:00Z" },
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
  { id: "epa-1", user_id: "mock_user_id", nr_number: "EPA", item_description: "Descarte de resíduos perigosos está sendo feito conforme regulamentação?", guidance: "Verificar licenças e registros de descarte.", created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
  { id: "iso50001-1", user_id: "mock_user_id", nr_number: "ISO 50001", item_description: "Existe um plano de gestão de energia documentado e comunicado?", guidance: "Revisar documentação e evidências de comunicação.", created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
  { id: "iso45001-1", user_id: "mock_user_id", nr_number: "ISO 45001", item_description: "A política de saúde e segurança ocupacional está implementada e é revisada periodicamente?", guidance: "Verificar registros de revisão e comunicação da política.", created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
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

const NRChecklist = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNr, setSelectedNr] = useState<string | null>(null);
  const [normas, setNormas] = useState<NormaRegulamentadora[]>(mockNormas);
  const [checklistRuns, setChecklistRuns] = useState<NrChecklistRun[]>(mockNrChecklistRuns);
  const { user } = useSession();

  // Estados para a execução do checklist
  const [currentRunItems, setCurrentRunItems] = useState<NrChecklistItem[]>([]);
  const [runNotes, setRunNotes] = useState("");
  const [runPhotos, setRunPhotos] = useState<ChecklistMedia[]>([]);
  const [runVideos, setRunVideos] = useState<ChecklistMedia[]>([]);
  const [signatureName, setSignatureName] = useState("");
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);

  // Estados para o diálogo de Nova Solicitação de Trabalho
  const [isNewWorkRequestDialogOpen, setIsNewWorkRequestDialogOpen] = useState(false);
  const [newWorkRequestInitialData, setNewWorkRequestInitialData] = useState<Partial<WorkRequest> | undefined>(undefined);

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

  const getNrTitle = (nrNumber: string) => {
    return normas.find(n => n.nr_number === nrNumber)?.title || nrNumber;
  };

  // Handlers para NRChecklistSelection
  const handleAddNorma = () => {
    toast.info("Funcionalidade 'Adicionar Nova Normativa' em desenvolvimento.");
  };

  const handleImportItems = () => {
    toast.info("Funcionalidade 'Importar Itens de Checklist' em desenvolvimento.");
  };

  const handleExportItems = () => {
    toast.info("Funcionalidade 'Exportar Itens de Checklist' em desenvolvimento.");
  };

  // Handlers para NRChecklistExecution
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

  const handleGenerateWorkRequest = () => {
    if (!selectedNr) {
      toast.error("Selecione uma normativa antes de gerar uma solicitação de trabalho.");
      return;
    }

    const nonCompliantItems = currentRunItems.filter(item => !item.is_header && item.is_compliant === false);
    let description = `Solicitação de Trabalho gerada a partir do Checklist de ${selectedNr}.\n\n`;

    if (nonCompliantItems.length > 0) {
      description += "Itens Não Conformes:\n";
      nonCompliantItems.forEach(item => {
        description += `- ${item.item_description}\n`;
        if (item.notes) description += `  Notas: ${item.notes}\n`;
      });
    } else {
      description += "Nenhum item não conforme foi encontrado, mas uma solicitação de trabalho foi gerada manualmente.\n";
    }

    if (runNotes) {
      description += `\nNotas Gerais do Checklist:\n${runNotes}\n`;
    }

    const initialAttachments: ChecklistMedia[] = [...runPhotos, ...runVideos];

    setNewWorkRequestInitialData({
      description: description,
      attachments: initialAttachments.length > 0 ? initialAttachments : undefined,
      // Você pode adicionar mais campos aqui, como assetId se o checklist estiver vinculado a um ativo
    });
    setIsNewWorkRequestDialogOpen(true);
  };

  const handleSaveWorkRequest = (newRequest: WorkRequest) => {
    // Aqui você integraria com a lógica real para salvar a solicitação de trabalho
    // Por enquanto, apenas logamos e mostramos um toast
    console.log("Nova Solicitação de Trabalho salva:", newRequest);
    toast.success(`Solicitação de Trabalho ${newRequest.id} criada com sucesso!`);
    setIsNewWorkRequestDialogOpen(false);
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
              Garanta o cumprimento de normativas como OSHA, NR's, EPA, ISO 50001 e ISO 45001, registrando informações detalhadas.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <NRChecklistSelection
              normas={normas}
              selectedNr={selectedNr}
              setSelectedNr={setSelectedNr}
              getNrTitle={getNrTitle}
              onAddNorma={handleAddNorma}
              onImportItems={handleImportItems}
              onExportItems={handleExportItems}
            />

            <NRChecklistExecution
              selectedNr={selectedNr}
              getNrTitle={getNrTitle}
              currentRunItems={currentRunItems}
              handleItemComplianceChange={handleItemComplianceChange}
              handleItemNotesChange={handleItemNotesChange}
              runPhotos={runPhotos}
              handlePhotoUpload={handlePhotoUpload}
              handleRemoveMedia={handleRemoveMedia}
              runVideos={runVideos}
              handleVideoUpload={handleVideoUpload}
              runNotes={runNotes}
              setRunNotes={setRunNotes}
              signatureName={signatureName}
              setSignatureName={setSignatureName}
              currentLocation={currentLocation}
              handleGetLocation={handleGetLocation}
              handleCompleteChecklist={handleCompleteChecklist}
              handleGenerateWorkRequest={handleGenerateWorkRequest}
            />
          </div>

          <NRChecklistHistory
            checklistRuns={checklistRuns}
            getNrTitle={getNrTitle}
          />
        </main>
      </div>

      {/* Diálogo para Nova Solicitação de Trabalho */}
      <NewWorkRequestDialog
        isOpen={isNewWorkRequestDialogOpen}
        onClose={() => setIsNewWorkRequestDialogOpen(false)}
        onSave={handleSaveWorkRequest}
        initialData={newWorkRequestInitialData}
      />
    </div>
  );
};

export default NRChecklist;