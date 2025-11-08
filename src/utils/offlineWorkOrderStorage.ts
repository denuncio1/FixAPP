"use client";

import { WorkOrder } from "@/types/work-order";
import { toast } from "sonner";

const OFFLINE_WORK_ORDERS_KEY = "offline_work_orders";

export const saveWorkOrderOffline = (workOrder: WorkOrder) => {
  try {
    const storedOrdersString = localStorage.getItem(OFFLINE_WORK_ORDERS_KEY);
    let storedOrders: WorkOrder[] = storedOrdersString ? JSON.parse(storedOrdersString) : [];

    const existingIndex = storedOrders.findIndex(order => order.id === workOrder.id);

    if (existingIndex > -1) {
      storedOrders[existingIndex] = workOrder; // Atualiza a OS existente
    } else {
      storedOrders.push(workOrder); // Adiciona nova OS
    }

    localStorage.setItem(OFFLINE_WORK_ORDERS_KEY, JSON.stringify(storedOrders));
    toast.success(`Ordem de Serviço ${workOrder.id} salva para uso offline!`);
  } catch (error) {
    console.error("Erro ao salvar OS offline:", error);
    toast.error("Erro ao salvar Ordem de Serviço offline.");
  }
};

export const getWorkOrderOffline = (id: string): WorkOrder | undefined => {
  try {
    const storedOrdersString = localStorage.getItem(OFFLINE_WORK_ORDERS_KEY);
    if (storedOrdersString) {
      const storedOrders: WorkOrder[] = JSON.parse(storedOrdersString);
      return storedOrders.find(order => order.id === id);
    }
  } catch (error) {
    console.error("Erro ao carregar OS offline:", error);
  }
  return undefined;
};

export const getAllOfflineWorkOrders = (): WorkOrder[] => {
  try {
    const storedOrdersString = localStorage.getItem(OFFLINE_WORK_ORDERS_KEY);
    return storedOrdersString ? JSON.parse(storedOrdersString) : [];
  } catch (error) {
    console.error("Erro ao carregar todas as OSs offline:", error);
    return [];
  }
};

export const removeWorkOrderOffline = (id: string) => {
  try {
    const storedOrdersString = localStorage.getItem(OFFLINE_WORK_ORDERS_KEY);
    if (storedOrdersString) {
      let storedOrders: WorkOrder[] = JSON.parse(storedOrdersString);
      storedOrders = storedOrders.filter(order => order.id !== id);
      localStorage.setItem(OFFLINE_WORK_ORDERS_KEY, JSON.stringify(storedOrders));
      toast.info(`Ordem de Serviço ${id} removida do armazenamento offline.`);
    }
  } catch (error) {
    console.error("Erro ao remover OS offline:", error);
    toast.error("Erro ao remover Ordem de Serviço offline.");
  }
};