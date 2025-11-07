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
import { Gauge, Wrench } from "lucide-react";

interface SensorReading {
  id: string;
  date: string;
  type: string;
  value: string;
}

interface AssetSensorsTabProps {
  sensorReadings: SensorReading[];
}

const AssetSensorsTab: React.FC<AssetSensorsTabProps> = ({ sensorReadings }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" /> Leituras de Sensores
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sensorReadings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensorReadings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>{reading.type}</TableCell>
                  <TableCell>{reading.value}</TableCell>
                  <TableCell className="text-right">{reading.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-sm">Nenhuma leitura de sensor disponível.</p>
        )}
        <Button variant="outline" className="mt-4 w-full" onClick={() => navigate("/maintenance/digital-meters")}>
          <Wrench className="h-4 w-4 mr-2" /> Gerenciar Medidores
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssetSensorsTab;