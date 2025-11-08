import React, { useEffect, useState } from "react";
import "./styles.css";
import {
  ChartScatterIcon,
  PackageIcon,
  SquaresFourIcon,
  FlaskIcon,
  type IconProps,
} from "@phosphor-icons/react";
import BentoInfo from "../shared/BentoInfo/BentoInfo";
import EmbalagemCard from "../shared/EmbalagemCard/EmbalagemCard";
import { ApiService } from "../../services/api.service";
import type { Product } from "../../types/i-product";

const Hero: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [aprovados, setAprovados] = useState<number>(0);
  const [comAvarias, setComAvarias] = useState<number>(0);

  useEffect(() => {
    // Carrega do localStorage primeiro para exibição rápida
    const storedProducts = localStorage.getItem("products");
    const storedAprovados = localStorage.getItem("aprovados");
    const storedComAvarias = localStorage.getItem("comAvarias");

    if (storedProducts && storedAprovados && storedComAvarias) {
      const parsedProducts = JSON.parse(storedProducts);
      setProducts(parsedProducts);
      setAprovados(Number(storedAprovados));
      setComAvarias(Number(storedComAvarias));
      console.log(`Carregados ${parsedProducts.length} produtos do localStorage`);
    }

    // Sempre busca da API para verificar se há atualizações
    ApiService.getProducts()
      .then((apiProducts) => {
        console.log(`Total de produtos retornados da API: ${apiProducts.length}`);
        
        // Compara se os dados mudaram
        const localCount = storedProducts ? JSON.parse(storedProducts).length : 0;
        const hasChanged = localCount !== apiProducts.length;

        if (hasChanged || !storedProducts) {
          console.log(`Dados diferentes detectados. localStorage: ${localCount}, API: ${apiProducts.length}`);
          // Atualiza o estado com os dados da API
          setProducts(apiProducts);
          const { aprovados, avarias } = ApiService.getAprovedProducts(apiProducts);
          setAprovados(aprovados);
          setComAvarias(avarias);
          
          // Atualiza o localStorage
          localStorage.setItem("products", JSON.stringify(apiProducts));
          localStorage.setItem("aprovados", aprovados.toString());
          localStorage.setItem("comAvarias", avarias.toString());
          console.log("localStorage atualizado com novos dados da API");
        } else {
          console.log("localStorage está atualizado com a API");
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
      });
  }, []);

  console.log("Aprovados:", aprovados);
  console.log("Com Avarias:", comAvarias);

  const totalAnalyses = products.length;
  const { aprovados: approvedCount } = ApiService.getAprovedProducts(products);
  const approvalRate = totalAnalyses
    ? Math.round((approvedCount / totalAnalyses) * 100)
    : 0;

  // Preparar dados do gráfico: usar janela fixa dos últimos 14 dias (evita muitos pontos e garante contagem por dia)
  const DAYS = 14;
  const today = new Date();
  // gerar as labels das últimas N datas (ISO date strings)
  const labels: string[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    labels.push(d.toISOString().split("T")[0]);
  }

  // contar ocorrências por dia
  const counts = labels.map(() => 0);
  products.forEach((p) => {
    if (!p.data) return; // Ignora produtos sem data
    const date = new Date(p.data);
    if (isNaN(date.getTime())) return; // Ignora datas inválidas
    const day = date.toISOString().split("T")[0];
    const idx = labels.indexOf(day);
    if (idx >= 0) counts[idx] += 1;
  });

  // gráfico removido: usamos BentoInfo para métricas diárias/mensais

  // Calcular estatísticas por tipo de produto
  const productStats = [
    {
      name: "Embalagens",
      icon: PackageIcon,
      tipos: ["Embalagem_Boa", "Embalagem_Com_Avaria", "Embalagem_Rosa"],
      aprovadosTipos: ["Embalagem_Boa"],
    },
    {
      name: "Blisters",
      icon: SquaresFourIcon,
      tipos: ["Blister_Completo", "Blister_Incompleto", "Blister_Vazio"],
      aprovadosTipos: ["Blister_Completo"],
    },
    {
      name: "Frascos",
      icon: FlaskIcon,
      tipos: [
        "Frasco_Completo",
        "Frasco_Incompleto",
        "Frasco_Rotulo_Incompleto",
        "Frasco_Sem_Dosador",
        "Frasco_Sem_Rotulo",
      ],
      aprovadosTipos: ["Frasco_Completo"],
    },
  ];

  const stats = productStats.map((stat) => {
    const filtered = products.filter((p) => stat.tipos.includes(p.tipo));
    const aprovados = filtered.filter((p) => stat.aprovadosTipos.includes(p.tipo)).length;
    const comAvaria = filtered.length - aprovados;
    
    return {
      name: stat.name,
      icon: stat.icon,
      aprovados,
      comAvaria,
      total: filtered.length,
    };
  });

  const BentoInfoProps = {
    header: "Análises Totais",
    infoValue: totalAnalyses,
    icon: ChartScatterIcon,
    iconProps: { size: 40, weight: "fill" } as IconProps,
  };

  return (
    <section className="section-hero items-center justify-center">
      <div className="grid grid-cols-3 grid-rows-auto gap-4 w-full h-full">
        <EmbalagemCard
          stats={stats}
          className="col-start-1 col-end-2 row-start-1 row-end-4 w-full h-full min-h-0 min-w-0 flex flex-col"
        />
        <BentoInfo
          {...BentoInfoProps}
          gridColumn="col-start-2 col-end-3"
          gridRow="row-start-1 row-end-2"
        />
        <BentoInfo
          header="Taxa de aprovação"
          infoValue={`${approvalRate}%`}
          icon={ChartScatterIcon}
          iconProps={{ size: 40, weight: "fill" } as IconProps}
          gridColumn="col-start-3 col-end-4"
          gridRow="row-start-1 row-end-2"
        />
        <BentoInfo
          header="Análises Diárias"
          infoValue={(() => {
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            return products.filter((p) => {
              const productDate = new Date(p.data);
              const productStr = `${productDate.getFullYear()}-${String(productDate.getMonth() + 1).padStart(2, '0')}-${String(productDate.getDate()).padStart(2, '0')}`;
              return productStr === todayStr;
            }).length;
          })()}
          percentageValue={(() => {
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const todayProducts = products.filter((p) => {
              const productDate = new Date(p.data);
              const productStr = `${productDate.getFullYear()}-${String(productDate.getMonth() + 1).padStart(2, '0')}-${String(productDate.getDate()).padStart(2, '0')}`;
              return productStr === todayStr;
            });
            const { aprovados: todayApproved } = ApiService.getAprovedProducts(todayProducts);
            return todayProducts.length > 0 ? Math.round((todayApproved / todayProducts.length) * 100) : 0;
          })()}
          icon={ChartScatterIcon}
          iconProps={{ size: 40, weight: "fill" } as IconProps}
          gridColumn="col-start-2 col-end-3"
          gridRow="row-start-2 row-end-3"
        />
        <BentoInfo
          header="Análises Mensais"
          infoValue={(() => {
            const now = new Date();
            return products.filter((p) => {
              const d = new Date(p.data);
              return (
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth()
              );
            }).length;
          })()}
          percentageValue={(() => {
            const now = new Date();
            const monthProducts = products.filter((p) => {
              const d = new Date(p.data);
              return (
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth()
              );
            });
            const { aprovados: monthApproved } = ApiService.getAprovedProducts(monthProducts);
            return monthProducts.length > 0 ? Math.round((monthApproved / monthProducts.length) * 100) : 0;
          })()}
          icon={ChartScatterIcon}
          iconProps={{ size: 40, weight: "fill" } as IconProps}
          gridColumn="col-start-3 col-end-4"
          gridRow="row-start-2 row-end-3"
        />
      </div>
    </section>
  );
};

export default Hero;
