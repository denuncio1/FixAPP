"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing, ShoppingCart } from "lucide-react";
import { Material } from "@/types/material";
import { useNavigate } from "react-router-dom";

interface LowStockAlertCardProps {
  lowStockMaterials: Material[];
  onGeneratePurchaseOrderForLowStock: () => void;
}

const LowStockAlertCard: React.FC<LowStockAlertCardProps> = ({
  lowStockMaterials,
  onGeneratePurchaseOrderForLowStock,
}) => {
  const navigate = useNavigate();

  if (lowStockMaterials.length === 0) {
    return null;
  }

  return (
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
        <Button className="mt-3 w-full" onClick={onGeneratePurchaseOrderForLowStock}>
          <ShoppingCart className="h-4 w-4 mr-2" /> Gerar OC para Itens com Baixo Estoque
        </Button>
      </CardContent>
    </Card>
  );
};

export default LowStockAlertCard;