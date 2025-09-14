// axios removido, usando fetch API nativa
import { type Product } from "../types/i-product";

const API_BASE_URL = "https://achecourtroom-backend.onrender.com/analise";

export class ApiService {
  static async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/all`);
    if (!response.ok) throw new Error("Erro ao buscar produtos");
    return response.json();
  }

  static async getProductById(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar produto");
    return response.json();
  }

  static async createProduct(product: Product): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Erro ao criar produto");
    return response.json();
  }

  static async updateProduct(
    id: number,
    product: Partial<Product>
  ): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Erro ao atualizar produto");
    return response.json();
  }

  static async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar produto");
  }

  static formatDateToBR(date: Date): string {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
  }
  static formatLabel(label: string): string {
    const labelMap: Record<string, string> = {
      Blister_Completo: "Blister Completo",
      Blister_Incompleto: "Blister Incompleto",
      Blister_Vazio: "Blister Vazio",
      Embalagem_Boa: "Embalagem Boa",
      Embalagem_Com_Avaria: "Embalagem com Avaria",
      Embalagem_Rosa: "Embalagem Rosa",
      Frasco_Completo: "Frasco Completo",
      Frasco_Incompleto: "Frasco Incompleto",
      Frasco_Rotulo_Incompleto: "Frasco com Rótulo Incompleto",
      Frasco_Sem_Dosador: "Frasco sem Dosador",
      Frasco_Sem_Rotulo: "Frasco sem Rótulo",
    };
    return labelMap[label] || label;
  }
}
