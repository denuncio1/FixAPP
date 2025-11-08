"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CheckCircle } from "lucide-react";

interface ComplianceDonutChartProps {
  compliancePercentage: number;
}

const ComplianceDonutChart: React.FC<ComplianceDonutChartProps> = ({ compliancePercentage }) => {
  const data = [
    { name: "Cumprido", value: compliancePercentage },
    { name: "Não Cumprido", value: 100 - compliancePercentage },
  ];

  const COLORS = ["#0088FE", "#E0E0E0"]; // Azul para cumprido, cinza para não cumprido

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" /> Porcentagem do Cumprimento
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-foreground">
              {compliancePercentage.toFixed(1)}%
            </text>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ComplianceDonutChart;