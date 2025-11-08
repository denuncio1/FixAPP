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
import { History } from "lucide-react";
import { NrChecklistRun } from "@/types/nr-checklist";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NRChecklistHistoryProps {
  checklistRuns: NrChecklistRun[];
  getNrTitle: (nrNumber: string) => string;
}

const NRChecklistHistory: React.FC<NRChecklistHistoryProps> = ({ checklistRuns, getNrTitle }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" /> Histórico de Execuções de Checklists
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Normativa</TableHead>
              <TableHead>Data de Conclusão</TableHead>
              <TableHead>Itens Conformes</TableHead>
              <TableHead>Itens Não Conformes</TableHead>
              <TableHead className="text-right">Conformidade (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checklistRuns.length > 0 ? (
              checklistRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-medium">{run.nr_number}</TableCell>
                  <TableCell>{format(new Date(run.completion_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                  <TableCell>{run.compliant_items}</TableCell>
                  <TableCell>{run.non_compliant_items}</TableCell>
                  <TableCell className="text-right">{run.compliance_percentage.toFixed(1)}%</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                  Nenhuma execução de checklist registrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default NRChecklistHistory;