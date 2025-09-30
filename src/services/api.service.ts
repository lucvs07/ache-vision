// axios removido, usando fetch API nativa
import { type Product } from "../types/i-product";

const API_BASE_URL = "https://achecourtroom-backend.onrender.com/analise";

const ProductStatus = {
  aprovado: ["Blister_Completo", "Embalagem_Boa", "Frasco_Completo"],
  com_avaria: [
    "Blister_Incompleto",
    "Blister_Vazio",
    "Embalagem_Com_Avaria",
    "Embalagem_Rosa",
    "Frasco_Incompleto",
    "Frasco_Rotulo_Incompleto",
    "Frasco_Sem_Dosador",
    "Frasco_Sem_Rotulo",
  ],
  embalagem: ["Embalagem_Boa", "Embalagem_Com_Avaria", "Embalagem_Rosa"],
  blister: ["Blister_Completo", "Blister_Incompleto", "Blister_Vazio"],
  frasco: [
    "Frasco_Completo",
    "Frasco_Incompleto",
    "Frasco_Rotulo_Incompleto",
    "Frasco_Sem_Dosador",
    "Frasco_Sem_Rotulo",
  ],
};

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
      method: "PATCH",
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

  static getAprovedProducts(products: Product[]): {
    aprovados: number;
    avarias: number;
  } {
    const aprovados = products.filter((product) =>
      ProductStatus.aprovado.includes(product.tipo)
    ).length;
    const avarias = products.filter((product) =>
      ProductStatus.com_avaria.includes(product.tipo)
    ).length;
    return { aprovados, avarias };
  }

static queryIndicatorsByHourAndDay(
    tipo: string,
    startHour: number,
    endHour: number,
    day: Date,
    products: Product[]
): { aprovados: number; avarias: number; tipo: string; range: string; dia: string, produtosFiltrados?: Product[] } {
    // Normaliza o dia para comparar apenas ano, mês e dia
    const targetDay = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()));

    const filtered = products.filter((product) => {
        const date = new Date(product.data);
        const productDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        const hour = date.getUTCHours();
        const isInHourRange = hour >= startHour && hour < endHour;
        const isTipo = product.tipo === tipo;
        const isSameDay = productDay.getTime() === targetDay.getTime();
        return isTipo && isInHourRange && isSameDay;
    });

    const aprovados = filtered.filter((product) =>
        ProductStatus.aprovado.includes(product.tipo)
    ).length;
    const avarias = filtered.filter((product) =>
        ProductStatus.com_avaria.includes(product.tipo)
    ).length;

    return {
        aprovados,
        avarias,
        tipo,
        range: `${startHour}:00 - ${endHour}:00`,
        dia: targetDay.toISOString().slice(0, 10),
        produtosFiltrados: filtered
    };
}
}
