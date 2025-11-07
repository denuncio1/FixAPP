"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

const ClientRegistration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Users className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-bold">Cadastro de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Esta é a página de cadastro de clientes. Em breve, você poderá adicionar novos clientes aqui.
          </p>
          <Button onClick={() => navigate(-1)}>Voltar</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRegistration;