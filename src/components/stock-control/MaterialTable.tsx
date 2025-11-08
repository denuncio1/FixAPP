"use client";

import React from "react";
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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Material } from "@/types/material";

interface MaterialTableProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredMaterials: Material[];
  handleAddMaterial: () => void;
  handleEditMaterial: (id: string) => void;
  handleDeleteMaterial: (id: string) => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({
  searchTerm,
  setSearchTerm,
  filteredMaterials,
  handleAddMaterial,
  handleEditMaterial,
  handleDeleteMaterial,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens em Estoque</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, código, descrição ou localização..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button className="flex items-center gap-2 w-full md:w-auto" onClick={handleAddMaterial}>
            <Plus className="h-4 w-4" />
            Novo Material
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Nível Mínimo</TableHead>
              <TableHead>Controlado por Serial</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.code}</TableCell>
                  <TableCell>{material.description}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        material.quantity <= material.minStockLevel
                          ? "bg-red-100 text-red-800 hover:bg-red-100/80"
                          : "bg-green-100 text-green-800 hover:bg-green-100/80"
                      }
                    >
                      {material.quantity} {material.unit}
                    </Badge>
                  </TableCell>
                  <TableCell>{material.minStockLevel} {material.unit}</TableCell>
                  <TableCell>{material.isSerialControlled ? "Sim" : "Não"}</TableCell>
                  <TableCell>{material.location}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditMaterial(material.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMaterial(material.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                  Nenhum material encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MaterialTable;