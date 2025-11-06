"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MapPin, QrCode, Factory, Building, Mountain, Globe, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Location } from "@/types/location";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import QRCode from "qrcode.react"; // CORREÇÃO AQUI: Importação como default export

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: -23.55052, // Centro de São Paulo
  lng: -46.633307,
};

const iconTypes = [
  { value: "factory", label: "Fábrica", icon: Factory },
  { value: "office", label: "Escritório", icon: Building },
  { value: "field", label: "Campo", icon: Mountain },
  { value: "other", label: "Outro", icon: Globe },
];

const LocationRegistration = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cep, setCep] = useState("");
  const [lat, setLat] = useState(defaultCenter.lat);
  const [lng, setLng] = useState(defaultCenter.lng);
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | undefined>(undefined);
  const [iconType, setIconType] = useState<string>("factory");
  const [status, setStatus] = useState(true); // true for active, false for inactive
  const [iotDevicesText, setIotDevicesText] = useState("");
  const [operatingHoursText, setOperatingHoursText] = useState("");

  const mapRef = useRef<google.maps.Map | null>(null);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setLat(event.latLng.lat());
      setLng(event.latLng.lng());
    }
  }, []);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setLat(event.latLng.lat());
      setLng(event.latLng.lng());
    }
  }, []);

  const { isLoaded: isMapsLoaded, loadError: mapsLoadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

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

      // Optionally, try to geocode the address to get lat/lng
      if (isMapsLoaded && window.google && window.google.maps.Geocoder) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: fullAddress }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location;
            setLat(location.lat());
            setLng(location.lng());
            mapRef.current?.panTo(location);
            toast.info("Coordenadas atualizadas via geocodificação!");
          } else {
            console.warn("Geocodificação falhou:", status);
            toast.warning("Não foi possível obter coordenadas exatas para o endereço.");
          }
        });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao buscar CEP. Tente novamente.");
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPhotoFile(file);
      setPhotoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const qrCodeValue = useMemo(() => {
    return JSON.stringify({ name, address, lat, lng, description });
  }, [name, address, lat, lng, description]);

  const handleViewOnMap = () => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
    } else {
      toast.error("Coordenadas não definidas para visualizar no mapa.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !lat || !lng) {
      toast.error("Por favor, preencha os campos obrigatórios: Nome, Endereço, Latitude e Longitude.");
      return;
    }

    const newLocation: Location = {
      id: `loc${Math.random().toString(36).substr(2, 9)}`,
      name,
      address,
      lat,
      lng,
      description: description || undefined,
      photoUrl: photoPreviewUrl,
      iconType: iconType,
      status: status ? "active" : "inactive",
      qrCodeData: qrCodeValue,
      iotDevices: iotDevicesText.split(",").map(d => d.trim()).filter(d => d !== ""),
      operatingHours: operatingHoursText || undefined,
    };

    console.log("Nova Localização Cadastrada:", newLocation);
    toast.success("Localização cadastrada com sucesso!");
    // Aqui você integraria com um backend para salvar a localização
    // Por enquanto, apenas limpamos o formulário e navegamos de volta
    setName("");
    setAddress("");
    setCep("");
    setLat(defaultCenter.lat);
    setLng(defaultCenter.lng);
    setDescription("");
    setPhotoFile(null);
    setPhotoPreviewUrl(undefined);
    setIconType("factory");
    setStatus(true);
    setIotDevicesText("");
    setOperatingHoursText("");
    navigate("/dashboard"); // Ou para uma lista de localizações
  };

  if (mapsLoadError) return <div>Erro ao carregar o mapa: {mapsLoadError.message}</div>;
  if (!isMapsLoaded) return <div>Carregando Mapa...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="relative flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl font-bold">Cadastro de Localização</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Informações Básicas */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Localização</Label>
              <Input
                id="name"
                placeholder="Filial Centro"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* CEP e Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="cep">CEP</Label>
                <div className="flex gap-2">
                  <Input
                    id="cep"
                    placeholder="Ex: 01000-000"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                  />
                  <Button type="button" onClick={handleCepSearch}>
                    Buscar CEP
                  </Button>
                </div>
              </div>
              <div className="grid gap-2 col-span-3">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Rua Exemplo, 123, Cidade, Estado"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Coordenadas e Mapa */}
            <div className="grid gap-2">
              <Label>Coordenadas Geográficas</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Latitude"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  step="any"
                  required
                />
                <Input
                  type="number"
                  placeholder="Longitude"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  step="any"
                  required
                />
              </div>
              <div className="mt-4 rounded-md overflow-hidden border">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{ lat, lng }}
                  zoom={14}
                  onLoad={onMapLoad}
                  onClick={onMapClick}
                >
                  <MarkerF
                    position={{ lat, lng }}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                  />
                </GoogleMap>
              </div>
              <Button type="button" variant="outline" onClick={handleViewOnMap} className="mt-2">
                <MapPin className="h-4 w-4 mr-2" /> Ver no Google Maps
              </Button>
            </div>

            {/* Descrição e Foto */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Detalhes adicionais sobre a localização..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photo">Foto do Local</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              {photoPreviewUrl && (
                <img src={photoPreviewUrl} alt="Pré-visualização da foto" className="mt-2 h-32 w-auto object-cover rounded-md" />
              )}
            </div>

            {/* Ícone Personalizado e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="iconType">Ícone Personalizado</Label>
                <Select value={iconType} onValueChange={setIconType}>
                  <SelectTrigger id="iconType">
                    <SelectValue placeholder="Selecione o tipo de local" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" /> {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <Switch
                  id="status"
                  checked={status}
                  onCheckedChange={setStatus}
                />
                <Label htmlFor="status">Status: {status ? "Ativa" : "Inativa"}</Label>
              </div>
            </div>

            {/* Horário de Funcionamento e Dispositivos IoT */}
            <div className="grid gap-2">
              <Label htmlFor="operatingHours">Horário de Funcionamento</Label>
              <Input
                id="operatingHours"
                placeholder="Ex: Seg-Sex, 8h-18h"
                value={operatingHoursText}
                onChange={(e) => setOperatingHoursText(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="iotDevices">Dispositivos IoT (separar por vírgula)</Label>
              <Input
                id="iotDevices"
                placeholder="Ex: Sensor de temperatura, Câmera de segurança"
                value={iotDevicesText}
                onChange={(e) => setIotDevicesText(e.target.value)}
              />
            </div>

            {/* QR Code */}
            <div className="grid gap-2 text-center">
              <Label>QR Code da Localização</Label>
              {name && address && lat && lng ? (
                <div className="flex justify-center">
                  <QRCode value={qrCodeValue} size={128} level="H" />
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Preencha os campos principais para gerar o QR Code.</p>
              )}
              <p className="text-xs text-muted-foreground">Este QR Code contém os dados básicos da localização.</p>
            </div>

            <Button type="submit" className="w-full">
              <MapPin className="h-4 w-4 mr-2" /> Cadastrar Localização
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationRegistration;