"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Trophy, Plus, Medal } from "lucide-react"; // 'Medal' adicionado aqui
import Sidebar from "@/components/Sidebar";
import GamificationDisplay from "@/components/GamificationDisplay";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import { GamificationStat } from "@/types/gamification";
import { Technician } from "@/types/technician";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const Gamification = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [gamificationStats, setGamificationStats] = useState<GamificationStat[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]); // To get user roles
  const { user, isLoading: isSessionLoading } = useSession();
  const [isManagerView, setIsManagerView] = useState(false);
  const [showAddPointsForm, setShowAddPointsForm] = useState(false);

  // Form states for adding points/medals
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>("");
  const [pointsToAdd, setPointsToAdd] = useState<number | string>("");
  const [medalToAdd, setMedalToAdd] = useState<string>("");
  const [availableMedals, setAvailableMedals] = useState<string[]>([
    "Estrela Dourada", "Mestre da Manutenção", "Recordista de OS", "Especialista em Elétrica", "Especialista em Hidráulica"
  ]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isSessionLoading) return;

      // Fetch profiles to determine user role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Erro ao carregar perfil do usuário.");
        return;
      }

      if (profileData && profileData.role === 'manager') {
        setIsManagerView(true);
      } else {
        setIsManagerView(false);
      }

      // Fetch technicians
      const { data: techniciansData, error: techniciansError } = await supabase
        .from('technicians')
        .select('*');

      if (techniciansError) {
        console.error("Error fetching technicians:", techniciansError);
        toast.error("Erro ao carregar técnicos.");
        return;
      }
      setTechnicians(techniciansData || []);

      // Fetch gamification stats
      const { data: statsData, error: statsError } = await supabase
        .from('gamification_stats')
        .select('*');

      if (statsError) {
        console.error("Error fetching gamification stats:", statsError);
        toast.error("Erro ao carregar estatísticas de gamificação.");
        return;
      }
      setGamificationStats(statsData || []);
    };

    fetchInitialData();
  }, [user, isSessionLoading]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleAddPoints = async () => {
    if (!selectedTechnicianId || !pointsToAdd || typeof pointsToAdd !== 'number' || pointsToAdd <= 0) {
      toast.error("Por favor, selecione um técnico e insira uma quantidade de pontos válida.");
      return;
    }

    let currentStat = gamificationStats.find(s => s.technician_id === selectedTechnicianId);

    if (currentStat) {
      // Update existing stat
      const { data, error } = await supabase
        .from('gamification_stats')
        .update({ points: currentStat.points + pointsToAdd, last_updated: new Date().toISOString() })
        .eq('technician_id', selectedTechnicianId)
        .select()
        .single();

      if (error) {
        console.error("Error updating points:", error);
        toast.error("Erro ao adicionar pontos.");
        return;
      }
      setGamificationStats(prev => prev.map(s => s.technician_id === selectedTechnicianId ? data : s));
    } else {
      // Create new stat
      const { data, error } = await supabase
        .from('gamification_stats')
        .insert({ technician_id: selectedTechnicianId, points: pointsToAdd })
        .select()
        .single();

      if (error) {
        console.error("Error inserting new stat:", error);
        toast.error("Erro ao adicionar pontos.");
        return;
      }
      setGamificationStats(prev => [...prev, data]);
    }
    toast.success(`Pontos adicionados para ${technicians.find(t => t.id === selectedTechnicianId)?.name}!`);
    setSelectedTechnicianId("");
    setPointsToAdd("");
    setShowAddPointsForm(false);
  };

  const handleAddMedal = async () => {
    if (!selectedTechnicianId || !medalToAdd) {
      toast.error("Por favor, selecione um técnico e uma medalha.");
      return;
    }

    let currentStat = gamificationStats.find(s => s.technician_id === selectedTechnicianId);

    if (currentStat) {
      if (currentStat.medals.includes(medalToAdd)) {
        toast.info("Este técnico já possui esta medalha.");
        return;
      }
      const updatedMedals = [...currentStat.medals, medalToAdd];
      const { data, error } = await supabase
        .from('gamification_stats')
        .update({ medals: updatedMedals, last_updated: new Date().toISOString() })
        .eq('technician_id', selectedTechnicianId)
        .select()
        .single();

      if (error) {
        console.error("Error updating medals:", error);
        toast.error("Erro ao adicionar medalha.");
        return;
      }
      setGamificationStats(prev => prev.map(s => s.technician_id === selectedTechnicianId ? data : s));
    } else {
      // Create new stat with medal
      const { data, error } = await supabase
        .from('gamification_stats')
        .insert({ technician_id: selectedTechnicianId, medals: [medalToAdd] })
        .select()
        .single();

      if (error) {
        console.error("Error inserting new stat with medal:", error);
        toast.error("Erro ao adicionar medalha.");
        return;
      }
      setGamificationStats(prev => [...prev, data]);
    }
    toast.success(`Medalha "${medalToAdd}" adicionada para ${technicians.find(t => t.id === selectedTechnicianId)?.name}!`);
    setSelectedTechnicianId("");
    setMedalToAdd("");
    setShowAddPointsForm(false);
  };

  const handleRemoveMedal = async (techId: string, medalToRemove: string) => {
    const currentStat = gamificationStats.find(s => s.technician_id === techId);
    if (!currentStat) return;

    const updatedMedals = currentStat.medals.filter(m => m !== medalToRemove);
    const { data, error } = await supabase
      .from('gamification_stats')
      .update({ medals: updatedMedals, last_updated: new Date().toISOString() })
      .eq('technician_id', techId)
      .select()
      .single();

    if (error) {
      console.error("Error removing medal:", error);
      toast.error("Erro ao remover medalha.");
      return;
    }
    setGamificationStats(prev => prev.map(s => s.technician_id === techId ? data : s));
    toast.success(`Medalha "${medalToRemove}" removida.`);
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Carregando...</h1>
          <p className="text-xl text-gray-600">Verificando sessão de usuário.</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold">Gamificação</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Engajamento de Técnicos</h2>
            <p className="text-muted-foreground">
              Motive sua equipe com rankings e reconhecimento por desempenho.
            </p>
          </div>

          {isManagerView && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Gerenciar Gamificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="select-technician">Técnico</Label>
                    <Select value={selectedTechnicianId} onValueChange={setSelectedTechnicianId}>
                      <SelectTrigger id="select-technician">
                        <SelectValue placeholder="Selecione um técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map(tech => (
                          <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="points-to-add">Pontos a Adicionar</Label>
                    <Input
                      id="points-to-add"
                      type="number"
                      value={pointsToAdd}
                      onChange={(e) => setPointsToAdd(parseInt(e.target.value) || "")}
                      placeholder="Ex: 100"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="medal-to-add">Medalha a Conceder</Label>
                    <Select value={medalToAdd} onValueChange={setMedalToAdd}>
                      <SelectTrigger id="medal-to-add">
                        <SelectValue placeholder="Selecione uma medalha" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMedals.map(medal => (
                          <SelectItem key={medal} value={medal}>{medal}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddPoints} disabled={!selectedTechnicianId || !pointsToAdd}>
                    Adicionar Pontos
                  </Button>
                  <Button onClick={handleAddMedal} disabled={!selectedTechnicianId || !medalToAdd}>
                    Conceder Medalha
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <GamificationDisplay
            gamificationStats={gamificationStats}
            technicians={technicians}
            isManagerView={isManagerView}
            currentUserId={user?.id}
          />

          {isManagerView && gamificationStats.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5" /> Gerenciar Medalhas Existentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gamificationStats.map(stat => (
                  <div key={stat.id} className="mb-4 pb-2 border-b last:border-b-0 last:pb-0">
                    <h3 className="font-semibold mb-2">{technicians.find(t => t.id === stat.technician_id)?.name}</h3>
                    {stat.medals.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {stat.medals.map((medal, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {medal}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => handleRemoveMedal(stat.technician_id, medal)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Nenhuma medalha.</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Gamification;