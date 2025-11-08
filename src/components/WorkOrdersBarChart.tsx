"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Wrench } from "lucide-react";

interface WorkOrdersBarChartProps {
  data: {
    name: string;
    "OSs Criadas": number;
    "OSs Finalizadas": number;
    "OSs Pendentes": number;
  }[];
}

const WorkOrdersBarChart: React.FC<WorkOrdersBarChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" /> Ordens de Serviço
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="OSs Criadas" fill="#8884d8" />
            <Bar dataKey="OSs Finalizadas" fill="#82ca9d" />
            <Bar dataKey="OSs Pendentes" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WorkOrdersBarChart;