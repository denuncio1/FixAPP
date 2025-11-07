"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu, Camera, ArrowLeft, Upload, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ImageRecognition = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [detectedFault, setDetectedFault] = useState<string | null>(null);
  const [assetIdentified, setAssetIdentified] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null); // Reset results on new file selection
      setDetectedFault(null);
      setAssetIdentified(null);
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(null);
      setAnalysisResult(null);
      setDetectedFault(null);
      setAssetIdentified(null);
    }
  };

  const handleAnalyzeImage = () => {
    if (!selectedFile) {
      toast.error("Por favor, selecione uma imagem para analisar.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setDetectedFault(null);
    setAssetIdentified(null);

    // Simulate API call
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.7) { // Simulate a successful detection
        setAnalysisResult("Sucesso");
        setDetectedFault(random < 0.3 ? "Desalinhamento de correia" : random < 0.5 ? "Vazamento de fluido" : "Desgaste excessivo");
        setAssetIdentified(random < 0.4 ? "Máquina de Produção X" : "Motor da Esteira 02");
        toast.success("Análise concluída: Falha detectada!");
      } else { // Simulate no fault or an error
        setAnalysisResult("Nenhuma falha detectada");
        toast.info("Análise concluída: Nenhuma falha aparente.");
      }
      setIsAnalyzing(false);
    }, 2000); // Simulate 2 seconds of processing
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Reconhecimento de Imagem</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Identificação de Falhas por Imagem</h2>
            <p className="text-muted-foreground">
              Utilize a inteligência artificial para detectar falhas em equipamentos através de imagens.
            </p>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-6 w-6" /> Análise de Imagem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="image-upload">Carregar Imagem do Equipamento</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {imagePreviewUrl && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Pré-visualização da Imagem</h3>
                  <img
                    src={imagePreviewUrl}
                    alt="Pré-visualização"
                    className="max-w-full h-auto max-h-80 object-contain mx-auto rounded-md border"
                  />
                </div>
              )}

              <Button
                onClick={handleAnalyzeImage}
                className="w-full"
                disabled={!selectedFile || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analisar Imagem
                  </>
                )}
              </Button>

              {analysisResult && (
                <div className="mt-6 p-4 border rounded-md bg-muted">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    {analysisResult === "Sucesso" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    Resultado da Análise:
                  </h3>
                  {detectedFault && assetIdentified ? (
                    <div className="space-y-1">
                      <p><span className="font-medium">Ativo Identificado:</span> {assetIdentified}</p>
                      <p><span className="font-medium">Falha Detectada:</span> {detectedFault}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        *Este é um resultado simulado. A integração com IA real forneceria diagnósticos mais precisos.
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {analysisResult === "Nenhuma falha detectada"
                        ? "Nenhuma falha aparente foi identificada na imagem. Continue monitorando ou realize uma inspeção manual."
                        : "Ocorreu um erro na análise ou a imagem não pôde ser processada."}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImageRecognition;