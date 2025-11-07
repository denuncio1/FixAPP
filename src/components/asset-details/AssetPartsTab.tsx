"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Boxes, DollarSign } from "lucide-react";

interface PartUsed {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: string; // Ex: "R$ 85,00"
}

interface AssetPartsTabProps {
  partsUsed: PartUsed[];
}

const AssetPartsTab: React.FC<AssetPartsTabProps> = ({ partsUsed }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Boxes className="h-5 w-5" /> Peças e Suprimentos Utilizados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {partsUsed.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Custo Unitário</TableHead>
                <TableHead className="text-right">Custo Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partsUsed.map((part) => (
                <TableRow key={part.id}>
                  <TableCell>{part.name}</TableCell>
                  <TableCell>{part.quantity} {part.unit}</TableCell>
                  <TableCell>{part.cost}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      parseFloat(part.cost.replace("R$", "").replace(",", ".")) * part.quantity
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-sm">Nenhuma peça ou suprimento registrado para este ativo.</p>
        )}
        <Button variant="outline" className="mt-4 w-full" onClick={() => navigate("/stock/control")}>
          <DollarSign className="h-4 w-4 mr-2" /> Gerenciar Estoque
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssetPartsTab;