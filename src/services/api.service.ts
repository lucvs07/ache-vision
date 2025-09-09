import axios, { AxiosResponse } from 'axios';

export interface IProduct {
    id: number;
    name: string;
    price: number;
    description?: string;
    // Add other product fields as needed
}

const API_BASE_URL = 'https://your-api-url.com/api';

export class ApiService {
    static async getProducts(): Promise<IProduct[]> {
        const response: AxiosResponse<IProduct[]> = await axios.get(`${API_BASE_URL}/products`);
        return response.data;
    }

    static async getProductById(id: number): Promise<IProduct> {
        const response: AxiosResponse<IProduct> = await axios.get(`${API_BASE_URL}/products/${id}`);
        return response.data;
    }
}