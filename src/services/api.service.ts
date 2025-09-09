import axios, { AxiosResponse } from "axios";
import { type Product } from "../types/i-product";

const API_BASE_URL = "https://your-api-url.com/api";

export class ApiService {
  static async getProducts(): Promise<Product[]> {
    const response: AxiosResponse<Product[]> = await axios.get(
      `${API_BASE_URL}/products`
    );
    return response.data;
  }

  static async getProductById(id: number): Promise<Product> {
    const response: AxiosResponse<Product> = await axios.get(
      `${API_BASE_URL}/products/${id}`
    );
    return response.data;
  }

  static async createProduct(product: Product): Promise<Product> {
    const response: AxiosResponse<Product> = await axios.post(
      `${API_BASE_URL}/products`,
      product
    );
    return response.data;
  }

  static async updateProduct(
    id: number,
    product: Partial<Product>
  ): Promise<Product> {
    const response: AxiosResponse<Product> = await axios.put(
      `${API_BASE_URL}/products/${id}`,
      product
    );
    return response.data;
  }
}
