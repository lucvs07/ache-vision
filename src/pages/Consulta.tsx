import React, { useState } from "react";
import { ApiService } from "../services/api.service";
import type { Product } from "../types/i-product";
import Modal from "../components/shared/Modal/Modal";
import { Calendar } from "lucide-react";

// Determina se o produto está aprovado ou defeituoso com base no tipo
const isProductApproved = (tipo: string): boolean => {
  const tiposAprovados = [
    "Frasco_Completo",
    "Embalagem_Boa",
    "Blister_Completo",
  ];
  return tiposAprovados.some((t) => tipo.toLowerCase() === t.toLowerCase());
};

const getProductStatus = (tipo: string): "aprovado" | "defeituoso" => {
  return isProductApproved(tipo) ? "aprovado" : "defeituoso";
};

const Consulta: React.FC = () => {
  const [tipo, setTipo] = useState("embalagem");
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState(0);
  const [horaFim, setHoraFim] = useState(23);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<{
    aprovados: number;
    avarias: number;
    tipo: string;
    range: string;
    dia: string;
    produtosFiltrados?: Product[];
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleFilter = async () => {
    try {
      const allProducts = await ApiService.getProducts();
      setProducts(allProducts);
      console.log("Todos os produtos carregados:", products);

      const result = ApiService.queryIndicatorsByHourAndDay(
        tipo,
        horaInicio,
        horaFim,
        new Date(dia),
        allProducts
      );

      setFilteredData(result);
    } catch (error) {
      console.error("Erro ao realizar o filtro:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white-100 p-6 font-outfit">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-krona text-black-800 mb-2">
                Consulta
              </h1>
              <p className="text-black-600 font-outfit">
                Filtre e visualize os registros por dia, hora e tipo
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white-50 rounded-xl shadow-sm border border-white-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black-700 mb-3 font-outfit">
                Data
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-orange-400" />
                <input
                  type="date"
                  title="Filtrar por data"
                  className="w-full pl-12 pr-4 py-3 border border-white-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white-50 font-outfit"
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black-700 mb-3 font-outfit">
                Hora de Início
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(Number(e.target.value))}
                  className="border border-white-300 rounded-lg p-3 w-full bg-white-50 font-outfit focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  placeholder="Hora de Início"
                  min={0}
                  max={23}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black-700 mb-3 font-outfit">
                Hora de Fim
              </label>
              <div>
                <input
                  type="number"
                  value={horaFim}
                  onChange={(e) => setHoraFim(Number(e.target.value))}
                  className="border border-white-300 rounded-lg p-3 w-full bg-white-50 font-outfit focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  placeholder="Hora de Fim"
                  min={0}
                  max={23}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black-700 mb-3 font-outfit">
                Status
              </label>
              <select
                className="w-full px-4 py-3 border border-white-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white-50 font-outfit"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                onSelect={(e) => setTipo(e.currentTarget.value)}
                name="status"
                title="status"
              >
                <option value="embalagem">Embalagem</option>
                <option value="blister">Blister</option>
                <option value="frasco">Frasco</option>
              </select>
            </div>
          </div>
          <div className="flex items-end mt-4">
            <button
              onClick={handleFilter}
              className="px-4 py-3 bg-gradient-to-r from-orange-500 to-sunset-500 text-white-50 rounded-lg hover:from-orange-600 hover:to-sunset-600 transition-all duration-200 flex items-center shadow-md font-medium"
            >
              Filtrar
            </button>
          </div>
        </div>
        {filteredData && (
          <div className="bg-white-50 rounded-xl shadow-lg border border-white-200 overflow-hidden mt-6">
            <div className="px-6 py-5 border-b border-white-200 bg-gradient-to-r from-orange-50 to-sunset-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black-800 font-krona">
                Resultados
              </h2>
              <div className="text-sm text-black-600 bg-white-50 px-3 py-1 rounded-full border border-orange-200">
                Total: {filteredData.produtosFiltrados?.length || 0} registros
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="mb-2">
                Tipo:{" "}
                <span className="font-semibold text-orange-700">
                  {filteredData.tipo.toUpperCase()}
                </span>
              </p>
              <p className="mb-2">
                Intervalo:{" "}
                <span className="font-semibold text-orange-700">
                  {filteredData.range}
                </span>
              </p>
              <p className="mb-2">
                Dia:{" "}
                <span className="font-semibold text-orange-700">
                  {filteredData.dia}
                </span>
              </p>
              <p className="mb-2">
                Aprovados:{" "}
                <span className="font-semibold text-success-700">
                  {filteredData.aprovados}
                </span>
              </p>
              <p className="mb-2">
                Com Avarias:{" "}
                <span className="font-semibold text-danger-700">
                  {filteredData.avarias}
                </span>
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-100 to-sunset-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-black-700 uppercase tracking-wider font-outfit">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-black-700 uppercase tracking-wider font-outfit">
                      Data
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-black-700 uppercase tracking-wider font-outfit">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-black-700 uppercase tracking-wider font-outfit">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-black-700 uppercase tracking-wider font-outfit">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white-50 divide-y divide-white-200">
                  {filteredData.produtosFiltrados?.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`hover:bg-gradient-to-r hover:from-orange-25 hover:to-sunset-25 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white-50" : "bg-white-100"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-700 font-outfit">
                        #{product.id.toString().padStart(4, "0")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black-700 font-medium font-outfit">
                        {new Date(product.data).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800 font-outfit">
                        <span className="font-semibold bg-white-200 px-3 py-1 rounded-lg border border-white-300">
                          {product.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${
                            getProductStatus(product.tipo) === "aprovado"
                              ? "bg-success-100 text-success-800 border-success-300"
                              : "bg-danger-100 text-danger-800 border-danger-300"
                          }`}
                        >
                          {getProductStatus(product.tipo) === "aprovado"
                            ? "✓ Aprovado"
                            : "✗ Defeituoso"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black-600">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="p-2.5 text-orange-600 hover:bg-orange-100 rounded-lg transition-all duration-200 border border-orange-200 hover:border-orange-300 shadow-sm cursor-pointer"
                          title="Visualizar detalhes"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredData.produtosFiltrados?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-orange-400 text-4xl mb-2">
                            Nenhum produto encontrado
                          </span>
                          <span className="text-black-500">
                            Não há registros para exibir.
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Modal */}
            {isModalOpen && selectedProduct && (
              <Modal
                open={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedProduct(null);
                }}
                {...selectedProduct}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Consulta;
