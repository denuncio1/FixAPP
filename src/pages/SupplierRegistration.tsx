"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck, Building, CheckCircle2, Mail, Phone, MapPin, Package, DollarSign, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Supplier } from "@/types/supplier"; // Importar a interface Supplier
import { Badge } from "@/components/ui/badge";
import AppLogo from "@/components/AppLogo"; // Importar AppLogo

const SupplierRegistration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("identificacao");

  const [companyName, setCompanyName] = useState("");
  const [cnpjCpf, setCnpjCpf] = useState("");
  const [status, setStatus] = useState<"Ativo" | "Inativo" | "Pendente">("Pendente");
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [paymentTerms, setPaymentTerms] = useState("");
  const [servicesProductsInput, setServicesProductsInput] = useState("");
  const [servicesProducts, setServicesProducts] = useState<string[]>([]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCepSearch = async () => {
    if (!cep) {
      toast.error("Por favor, digite um CEP.");
      return;
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado.");
        return;
      }

      const fullAddress = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
      setAddress(fullAddress);
      toast.success("Endereço preenchido via CEP!");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao buscar CEP. Tente novamente.");
    }
  };

  const handleAddServiceProduct = () => {
    const newItems = servicesProductsInput.split(',').map(item => item.trim()).filter(item => item !== '');
    setServicesProducts(prev => [...new Set([...prev, ...newItems])]); // Adiciona sem duplicatas
    setServicesProductsInput('');
  };

  const handleRemoveServiceProduct = (itemToRemove: string) => {
    setServicesProducts(prev => prev.filter(item => item !== itemToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !cnpjCpf || !address || !cep || !contactName || !contactEmail || !contactPhone) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newSupplier: Supplier = {
      id: `sup${Math.random().toString(36).substr(2, 9)}`,
      status,
      companyName,
      cnpjCpf,
      logoUrl,
      address,
      cep,
      contactName,
      contactEmail,
      contactPhone,
      paymentTerms: paymentTerms || undefined,
      servicesProducts: servicesProducts.length > 0 ? servicesProducts : undefined,
    };

    console.log("Novo Fornecedor Cadastrado:", newSupplier);
    toast.success("Fornecedor cadastrado com sucesso!");

    // Limpar formulário
    setCompanyName("");
    setCnpjCpf("");
    setStatus("Pendente");
    setLogoUrl(undefined);
    setCep("");
    setAddress("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setPaymentTerms("");
    setServicesProductsInput("");
    setServicesProducts([]);

    navigate("/dashboard"); // Ou para uma lista de fornecedores
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="relative flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-4">
            <AppLogo className="h-8 w-auto" /> {/* Usar AppLogo aqui */}
            <div>
              <CardTitle className="text-xl font-bold">Cadastro de Fornecedores</CardTitle>
              <p className="text-sm text-muted-foreground">Registre novos parceiros e fornecedores</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="absolute right-4 top-4"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="identificacao">Identificação</TabsTrigger>
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="comercial">Comercial</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit}>
              <TabsContent value="identificacao" className="mt-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 border-2 border-primary/50">
                    <AvatarImage src={logoUrl || "/placeholder.svg"} alt="Logo do Fornecedor" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Truck className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer text-sm text-blue-600 hover:underline mt-2 block text-center"
                  >
                    Adicionar/Alterar Logo
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Razão Social *</Label>
                    <Input
                      id="companyName"
                      placeholder="Nome da Empresa Ltda."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cnpjCpf">CNPJ/CPF *</Label>
                    <Input
                      id="cnpjCpf"
                      placeholder="XX.XXX.XXX/XXXX-XX ou XXX.XXX.XXX-XX"
                      value={cnpjCpf}
                      onChange={(e) => setCnpjCpf(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={status} onValueChange={(value: "Ativo" | "Inativo" | "Pendente") => setStatus(value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="endereco" className="mt-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="cep"
                        placeholder="Ex: 01000-000"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        required
                      />
                      <Button type="button" onClick={handleCepSearch}>
                        Buscar CEP
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Endereço *</Label>
                    <Input
                      id="address"
                      placeholder="Rua Exemplo, 123, Cidade, Estado"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contato" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contactName">Nome do Contato *</Label>
                    <Input
                      id="contactName"
                      placeholder="João da Silva"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactEmail">E-mail do Contato *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="contato@empresa.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactPhone">Telefone do Contato *</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="(XX) XXXXX-XXXX"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="comercial" className="mt-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="paymentTerms">Termos de Pagamento</Label>
                    <Textarea
                      id="paymentTerms"
                      placeholder="Ex: Pagamento em 30 dias, 50% adiantado"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="servicesProducts">Serviços/Produtos Fornecidos</Label>
                    <div className="flex gap-2">
                      <Input
                        id="servicesProducts"
                        placeholder="Ex: Peças elétricas, Manutenção hidráulica (separar por vírgula)"
                        value={servicesProductsInput}
                        onChange={(e) => setServicesProductsInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddServiceProduct();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddServiceProduct}>Adicionar</Button>
                    </div>
                    {servicesProducts.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {servicesProducts.map((item) => (
                          <Badge key={item} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => handleRemoveServiceProduct(item)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Truck className="h-4 w-4 mr-2" /> Cadastrar Fornecedor
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierRegistration;