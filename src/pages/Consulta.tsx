import React, { useState } from "react";
import { ApiService } from "../services/api.service";
import type { Product } from "../types/i-product";
import Modal from "../components/shared/Modal/Modal";
import { Calendar, ChartScatterIcon } from "lucide-react";
import { type IconProps } from "@phosphor-icons/react";
import BentoInfo from "../components/shared/BentoInfo/BentoInfo";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  // Retorna a classe de estilo para cada BentoInfo
  const getBentoInfoClass = (
    type: "aprovados" | "avarias" | "taxa",
    value: number
  ) => {
    if (type === "aprovados") return "text-success-700";
    if (type === "avarias") return "text-danger-700";
    if (type === "taxa") {
      if (value < 50) return "text-danger-700";
      if (value < 80) return "text-warning-700";
      return "text-success-700";
    }
    return "";
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
            <div className="px-6 py-4 flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <span className="text-black-600">Tipo:</span>
                <span className="font-semibold text-orange-700 uppercase bg-orange-50 px-3 py-1 rounded-full shadow-sm">
                  {filteredData.tipo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-black-600">Intervalo:</span>
                <span className="font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full shadow-sm">
                  {filteredData.range}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-black-600">Dia:</span>
                <span className="font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full shadow-sm">
                  {filteredData.dia}
                </span>
              </div>
            </div>

            {filteredData?.produtosFiltrados &&
              filteredData.produtosFiltrados.length > 0 && (
                <>
                  <div className="grid grid-cols-3 grid-rows-auto gap-4 w-full h-full p-4">
                    <BentoInfo
                      header="Aprovados"
                      infoValue={`${filteredData.aprovados}`}
                      icon={ChartScatterIcon}
                      iconProps={{ size: 40, weight: "fill" } as IconProps}
                      gridColumn="col-start-1 col-end-2"
                      gridRow="row-start-1 row-end-2"
                      styleStat={getBentoInfoClass(
                        "aprovados",
                        filteredData.aprovados
                      )}
                    />
                    <BentoInfo
                      header="Com Avarias"
                      infoValue={`${filteredData.avarias}`}
                      icon={ChartScatterIcon}
                      iconProps={{ size: 40, weight: "fill" } as IconProps}
                      gridColumn="col-start-2 col-end-3"
                      gridRow="row-start-1 row-end-2"
                      styleStat={getBentoInfoClass(
                        "avarias",
                        filteredData.avarias
                      )}
                    />
                    <BentoInfo
                      header="Taxa de Aprovação"
                      infoValue={`${
                        filteredData.produtosFiltrados &&
                        filteredData.produtosFiltrados.length > 0
                          ? (
                              (filteredData.aprovados /
                                filteredData.produtosFiltrados.length) *
                              100
                            ).toFixed(2)
                          : "0.00"
                      }%`}
                      icon={ChartScatterIcon}
                      iconProps={{ size: 40, weight: "fill" } as IconProps}
                      gridColumn="col-start-3 col-end-4"
                      gridRow="row-start-1 row-end-2"
                      styleStat={getBentoInfoClass(
                        "taxa",
                        filteredData.avarias
                      )}
                    />
                  </div>
                  <div className="mt-8 p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Análise por Hora
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={(() => {
                          // Group products by hour and count aprovados/avarias
                          const hours = Array.from({ length: 24 }, (_, i) => i);
                          const byHour = hours.map((h) => {
                            const produtosHora =
                              filteredData.produtosFiltrados!.filter((p) => {
                                const d = new Date(p.data);
                                return d.getHours() === h;
                              });
                            const aprovados = produtosHora.filter(
                              (p) => getProductStatus(p.tipo) === "aprovado"
                            ).length;
                            const avarias = produtosHora.filter(
                              (p) => getProductStatus(p.tipo) === "defeituoso"
                            ).length;
                            return {
                              hora: h,
                              aprovados,
                              avarias,
                            };
                          });
                          // Only show hours in selected range
                          return byHour.filter(
                            (h) => h.hora >= horaInicio && h.hora <= horaFim
                          );
                        })()}
                        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="hora"
                          tickFormatter={(h) => `${h}:00`}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                          formatter={(v) => v}
                          labelFormatter={(h) => `Hora: ${h}:00`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="aprovados"
                          stroke="#82ca9d"
                          name="Aprovados"
                        />
                        <Line
                          type="monotone"
                          dataKey="avarias"
                          stroke="#ff6b6b"
                          name="Avarias"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            <div className="flex justify-center items-center min-h-[120px] w-full">
              {filteredData.produtosFiltrados?.length === 0 && (
                <div className="flex flex-col items-center">
                  <span className="text-orange-400 text-4xl mb-2">
                    Nenhum produto encontrado
                  </span>
                  <span className="text-black-500">
                    Não há registros para exibir.
                  </span>
                </div>
              )}
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
