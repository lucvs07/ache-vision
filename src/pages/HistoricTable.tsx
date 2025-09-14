import React, { useEffect, useState } from "react";
import { ApiService } from "../services/api.service";
import type { Product } from "../types/i-product";

const HistoricTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterTipo, setFilterTipo] = useState("");
  const [filterData, setFilterData] = useState("");

  useEffect(() => {
    ApiService.getProducts().then(setProducts);
  }, []);

  const filtered = products.filter((p) => {
    const tipoMatch = filterTipo ? p.tipo.toLowerCase().includes(filterTipo.toLowerCase()) : true;
    const dataMatch = filterData ? new Date(p.data).toLocaleDateString() === filterData : true;
    return tipoMatch && dataMatch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Histórico</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Filtrar por tipo"
          className="border rounded px-2 py-1"
          value={filterTipo}
          onChange={e => setFilterTipo(e.target.value)}
        />
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={filterData}
          onChange={e => setFilterData(e.target.value)}
          placeholder="Filtrar por data"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Data</th>
              <th className="px-4 py-2 border">Tipo</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Veracidade</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{p.id}</td>
                <td className="px-4 py-2 border">{new Date(p.data).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">{p.tipo}</td>
                <td className="px-4 py-2 border">{p.status}</td>
                <td className="px-4 py-2 border">{p.veracidade}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">Nenhum resultado encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricTable;
