"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertTriangle, Wrench, PauseCircle, Package } from "lucide-react";

interface DashboardKpiCardsProps {
  ossInVerification: number;
  ossConcluidas: number;
  tarefasAtrasadas: number;
  paradasPlanejadas: number;
  paradasNaoPlanejadas: number;
  ativosParados: number;
  severidadeFalhas: string; // Ex: "Baixa", "Média", "Alta"
}

const DashboardKpiCards: React.FC<DashboardKpiCardsProps> = ({
  ossInVerification,
  ossConcluidas,
  tarefasAtrasadas,
  paradasPlanejadas,
  paradasNaoPlanejadas,
  ativosParados,
  severidadeFalhas,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">OSs em Verificação</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ossInVerification}</div>
          <p className="text-xs text-muted-foreground">
            Aguardando aprovação
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">OSs Concluídas</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ossConcluidas}</div>
          <p className="text-xs text-muted-foreground">
            Total este mês
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{tarefasAtrasadas}</div>
          <p className="text-xs text-muted-foreground">
            Exigem atenção imediata
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paradas Planejadas</CardTitle>
          <PauseCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{paradasPlanejadas}</div>
          <p className="text-xs text-muted-foreground">
            Próximas manutenções
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paradas Não Planejadas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{paradasNaoPlanejadas}</div>
          <p className="text-xs text-muted-foreground">
            Impacto na produção
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ativos Parados</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ativosParados}</div>
          <p className="text-xs text-muted-foreground">
            Atualmente inoperantes
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Severidade das Falhas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{severidadeFalhas}</div>
          <p className="text-xs text-muted-foreground">
            Média geral
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardKpiCards;