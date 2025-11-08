"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

interface StockOverviewCardsProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  totalStockValue: number;
  formatCurrency: (value: number) => string;
}

const StockOverviewCards: React.FC<StockOverviewCardsProps> = ({
  isEnabled,
  setIsEnabled,
  totalStockValue,
  formatCurrency,
}) => {
  return (
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
  );
};

export default StockOverviewCards;