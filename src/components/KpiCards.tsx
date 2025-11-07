"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, Gauge, TrendingUp } from "lucide-react";

interface KpiCardsProps {
  kpis: {
    avgResponseTime: string;
    costPerWorkOrder: string;
    assetAvailability: string;
  };
}

const KpiCards: React.FC<KpiCardsProps> = ({ kpis }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tempo Médio de Atendimento
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.avgResponseTime}</div>
          <p className="text-xs text-muted-foreground">
            Meta: 4 horas
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Custo Médio por OS
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.costPerWorkOrder}</div>
          <p className="text-xs text-muted-foreground">
            Redução de 5% este mês
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Disponibilidade de Ativos
          </CardTitle>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.assetAvailability}</div>
          <p className="text-xs text-muted-foreground">
            +2% em relação ao mês passado
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiCards;