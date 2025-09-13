// axios removido, usando fetch API nativa
import { type Product } from "../types/i-product";

const API_BASE_URL = "https://achecourtroom-backend.onrender.com/analise/";

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
}
