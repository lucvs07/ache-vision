import React, { useEffect, useState } from "react";
import { ApiService } from "../services/api.service";
import type { Product } from "../types/i-product";
import Modal from "../components/shared/Modal/Modal";
import {
  Eye,
  Check,
  X,
  Trash2,
  Search,
  Calendar,
  Filter,
  Download,
} from "lucide-react";

const HistoricTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterTipo, setFilterTipo] = useState("");
  const [filterData, setFilterData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    ApiService.getProducts().then(setProducts).catch(console.error);
  }, []);

  const filtered = products.filter((p) => {
    const tipoMatch = filterTipo
      ? p.tipo.toLowerCase().includes(filterTipo.toLowerCase())
      : true;
    const dataMatch = filterData
      ? new Date(p.data).toISOString().split("T")[0] === filterData
      : true;
    return tipoMatch && dataMatch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleApprove = async (product: Product) => {
    try {
      await ApiService.updateProduct(product.id, {
        ...product,
        status: "aprovado",
      });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, status: "aprovado" } : p
        )
      );
    } catch (error) {
      console.error("Erro ao aprovar:", error);
    }
  };

  const handleReject = async (product: Product) => {
    try {
      await ApiService.updateProduct(product.id, {
        ...product,
        status: "rejeitado",
      });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, status: "rejeitado" } : p
        )
      );
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
    }
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        await ApiService.deleteProduct(product.id);
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { bg: string; text: string; label: string; border: string }
    > = {
      aprovado: {
        bg: "bg-success-100",
        text: "text-success-800",
        label: "Aprovado",
        border: "border-success-300",
      },
      rejeitado: {
        bg: "bg-danger-100",
        text: "text-danger-800",
        label: "Rejeitado",
        border: "border-danger-300",
      },
      verificar: {
        bg: "bg-warning-100",
        text: "text-warning-800",
        label: "Verificar",
        border: "border-warning-300",
      },
      pendente: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        label: "Pendente",
        border: "border-orange-300",
      },
    };
    const config = statusMap[status] || statusMap.pendente;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.label}
      </span>
    );
  };

  const getVeracidadeBar = (veracidade: string) => {
    // Converter veracidade para porcentagem (assumindo que é uma string como "80%" ou um número)
    const percentage = parseInt(veracidade.toString().replace("%", "")) || 0;

    let colorClass = "bg-danger-500";
    let bgClass = "bg-danger-100";
    if (percentage >= 80) {
      colorClass = "bg-success-500";
      bgClass = "bg-success-100";
    } else if (percentage >= 60) {
      colorClass = "bg-warning-500";
      bgClass = "bg-warning-100";
    } else if (percentage >= 40) {
      colorClass = "bg-orange-500";
      bgClass = "bg-orange-100";
    }

    // Calcular largura baseada na porcentagem
    const getWidthClass = (perc: number) => {
      if (perc >= 95) return "w-full";
      if (perc >= 90) return "w-11/12";
      if (perc >= 85) return "w-5/6";
      if (perc >= 80) return "w-4/5";
      if (perc >= 75) return "w-3/4";
      if (perc >= 70) return "w-7/12";
      if (perc >= 65) return "w-2/3";
      if (perc >= 60) return "w-3/5";
      if (perc >= 55) return "w-11/20";
      if (perc >= 50) return "w-1/2";
      if (perc >= 45) return "w-2/5";
      if (perc >= 40) return "w-2/5";
      if (perc >= 35) return "w-1/3";
      if (perc >= 30) return "w-3/10";
      if (perc >= 25) return "w-1/4";
      if (perc >= 20) return "w-1/5";
      if (perc >= 15) return "w-3/20";
      if (perc >= 10) return "w-1/6";
      if (perc >= 5) return "w-1/12";
      return "w-1/12";
    };

    return (
      <div className="flex items-center space-x-3 min-w-36">
        <div
          className={`flex-1 ${bgClass} rounded-full h-2.5 relative overflow-hidden border border-white-300`}
        >
          <div
            className={`h-full ${colorClass} rounded-full transition-all duration-700 ${getWidthClass(
              percentage
            )}`}
          />
        </div>
        <span
          className={`text-xs font-bold min-w-10 ${
            percentage >= 80
              ? "text-success-700"
              : percentage >= 60
              ? "text-warning-700"
              : percentage >= 40
              ? "text-orange-700"
              : "text-danger-700"
          }`}
        >
          {percentage}%
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white-100 p-6 font-outfit">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-krona text-black-800 mb-2">
                Histórico
              </h1>
              <p className="text-black-600 font-outfit">
                Gerencie e visualize todos os registros do sistema
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 bg-white-50 border border-orange-200 rounded-lg text-sm font-medium text-orange-700 hover:bg-orange-50 transition-colors shadow-sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white-50 rounded-xl shadow-sm border border-white-200 p-6 mb-6">
            <div className="flex flex-wrap gap-6">
              <div className="flex-1 min-w-64">
                <label className="block text-sm font-semibold text-black-700 mb-3 font-outfit">
                  Filtrar por tipo
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-orange-400" />
                  <input
                    type="text"
                    placeholder="Digite o tipo para buscar..."
                    className="w-full pl-12 pr-4 py-3 border border-white-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white-50 font-outfit"
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-semibold text-black-700 mb-3 font-outfit">
                  Filtrar por data
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-orange-400" />
                  <input
                    type="date"
                    title="Filtrar por data"
                    className="w-full pl-12 pr-4 py-3 border border-white-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white-50 font-outfit"
                    value={filterData}
                    onChange={(e) => setFilterData(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button className="px-4 py-3 bg-gradient-to-r from-orange-500 to-sunset-500 text-white-50 rounded-lg hover:from-orange-600 hover:to-sunset-600 transition-all duration-200 flex items-center shadow-md font-medium">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white-50 rounded-xl shadow-lg border border-white-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-white-200 bg-gradient-to-r from-orange-50 to-sunset-50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black-800 font-krona">
                Registros
              </h2>
              <div className="text-sm text-black-600 bg-white-50 px-3 py-1 rounded-full border border-orange-200">
                Total: {filtered.length} registros
              </div>
            </div>
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
                    Veracidade
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-black-700 uppercase tracking-wider font-outfit">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white-50 divide-y divide-white-200">
                {paginatedProducts.map((product, index) => (
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
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getVeracidadeBar(product.veracidade)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-600">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="p-2.5 text-orange-600 hover:bg-orange-100 rounded-lg transition-all duration-200 border border-orange-200 hover:border-orange-300 shadow-sm cursor-pointer"
                          title="Visualizar detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {product.status !== "aprovado" && (
                          <button
                            onClick={() => handleApprove(product)}
                            className="p-2.5 text-success-600 hover:bg-success-100 rounded-lg transition-all duration-200 border border-success-200 hover:border-success-300 shadow-sm cursor-pointer"
                            title="Aprovar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {product.status !== "rejeitado" && (
                          <button
                            onClick={() => handleReject(product)}
                            className="p-2.5 text-danger-600 hover:bg-danger-100 rounded-lg transition-all duration-200 border border-danger-200 hover:border-danger-300 shadow-sm cursor-pointer"
                            title="Rejeitar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2.5 text-black-600 hover:bg-black-100 rounded-lg transition-all duration-200 border border-black-200 hover:border-black-300 shadow-sm cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-sunset-100 rounded-full flex items-center justify-center mb-6">
                          <Search className="w-10 h-10 text-orange-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-black-800 mb-2 font-krona">
                          Nenhum resultado encontrado
                        </h3>
                        <p className="text-black-600 font-outfit">
                          Tente ajustar os filtros para encontrar o que está
                          procurando.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-5 border-t border-white-200 bg-gradient-to-r from-orange-50 to-sunset-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-black-700 font-medium font-outfit">
                  Mostrando {startIndex + 1} -{" "}
                  {Math.min(startIndex + itemsPerPage, filtered.length)} de{" "}
                  {filtered.length} • Página {currentPage} de {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm border border-orange-300 rounded-lg hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white-50 text-black-700 font-outfit"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-outfit ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-orange-500 to-sunset-500 text-white-50 shadow-md"
                            : "border border-orange-300 hover:bg-orange-100 bg-white-50 text-black-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm border border-orange-300 rounded-lg hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white-50 text-black-700 font-outfit"
                  >
                    Próximo
                  </button>
                </div>
              </div>
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
    </div>
  );
};

export default HistoricTable;
