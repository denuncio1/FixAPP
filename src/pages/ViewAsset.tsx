"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AppLogo from "@/components/AppLogo";

// Importar dados mockados centralizados
import {
  mockAssets,
  mockLocations,
  mockTechnicians,
  mockWorkOrders,
  mockAttachments,
  mockSensorReadings,
  mockPartsUsed,
} from "@/data/mockAssetData";

// Importar os novos componentes de aba
import AssetOverviewTab from "@/components/asset-details/AssetOverviewTab";
import AssetInterventionsTab from "@/components/asset-details/AssetInterventionsTab";
import AssetAttachmentsTab from "@/components/asset-details/AssetAttachmentsTab";
import AssetSensorsTab from "@/components/asset-details/AssetSensorsTab";
import AssetPartsTab from "@/components/asset-details/AssetPartsTab";

const ViewAsset = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<typeof mockAssets[0] | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const foundAsset = mockAssets.find((a) => a.id === id);
    if (foundAsset) {
      setAsset(foundAsset);
    } else {
      navigate("/assets");
    }
  }, [id, navigate]);

  const assetWorkOrders = useMemo(() => {
    return mockWorkOrders.filter(wo => wo.assetId === id);
  }, [id]);

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Carregando detalhes do ativo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-6xl">
        <CardHeader className="relative flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/assets")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <AppLogo className="h-8 w-auto" />
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6" /> {asset.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Código: {asset.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Editar Ativo</Button>
            <Badge
              className={
                asset.status === "Operacional"
                  ? "bg-green-100 text-green-800"
                  : asset.status === "Em Manutenção"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }
            >
              Status: {asset.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="interventions">Histórico de Intervenções</TabsTrigger>
              <TabsTrigger value="attachments">Anexos e Documentos</TabsTrigger>
              <TabsTrigger value="sensors">Sensores e Leituras</TabsTrigger>
              <TabsTrigger value="parts">Peças e Suprimentos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <AssetOverviewTab asset={asset} locations={mockLocations} technicians={mockTechnicians} />
            </TabsContent>

            <TabsContent value="interventions" className="mt-6">
              <AssetInterventionsTab asset={asset} assetWorkOrders={assetWorkOrders} />
            </TabsContent>

            <TabsContent value="attachments" className="mt-6">
              <AssetAttachmentsTab attachments={mockAttachments} />
            </TabsContent>

            <TabsContent value="sensors" className="mt-6">
              <AssetSensorsTab sensorReadings={mockSensorReadings} />
            </TabsContent>

            <TabsContent value="parts" className="mt-6">
              <AssetPartsTab partsUsed={mockPartsUsed} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewAsset;