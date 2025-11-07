"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star } from "lucide-react";
import { GamificationStat } from "@/types/gamification";
import { Technician } from "@/types/technician"; // Assuming Technician type is available

interface GamificationDisplayProps {
  gamificationStats: GamificationStat[];
  technicians: Technician[]; // To get technician names
  isManagerView: boolean;
  currentUserId?: string; // For technician view
}

const GamificationDisplay: React.FC<GamificationDisplayProps> = ({
  gamificationStats,
  technicians,
  isManagerView,
  currentUserId,
}) => {
  const getTechnicianName = (technicianId: string) => {
    const tech = technicians.find(t => t.id === technicianId);
    return tech ? tech.name : "Técnico Desconhecido";
  };

  const sortedStats = [...gamificationStats].sort((a, b) => b.points - a.points);

  const displayStats = isManagerView
    ? sortedStats
    : sortedStats.filter(stat => {
        const tech = technicians.find(t => t.id === stat.technician_id);
        return tech && tech.user_id === currentUserId;
      });

  if (displayStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" /> Gamificação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nenhum dado de gamificação disponível no momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" /> Ranking de Técnicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posição</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayStats.map((stat, index) => (
                <TableRow key={stat.id}>
                  <TableCell className="font-medium">{index + 1}º</TableCell>
                  <TableCell>{getTechnicianName(stat.technician_id)}</TableCell>
                  <TableCell className="text-right">{stat.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5" /> Medalhas Conquistadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayStats.map((stat) => (
            <div key={stat.id} className="mb-4 last:mb-0">
              <h3 className="font-semibold mb-2">{getTechnicianName(stat.technician_id)}</h3>
              {stat.medals.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {stat.medals.map((medal, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" /> {medal}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhuma medalha ainda.</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationDisplay;