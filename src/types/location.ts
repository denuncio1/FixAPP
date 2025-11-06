export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  description?: string;
  photoUrl?: string;
  iconType?: string; // Ex: 'factory', 'office', 'field'
  status: "active" | "inactive";
  qrCodeData?: string; // Dados para o QR Code
  iotDevices?: string[]; // Lista de IDs ou nomes de dispositivos IoT
  operatingHours?: string; // Ex: "Seg-Sex, 8h-18h"
}