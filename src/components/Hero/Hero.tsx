import React, { useEffect, useState } from "react";
import "./styles.css";
import {
  ChartScatterIcon,
  UserIcon,
  type IconProps,
} from "@phosphor-icons/react";
import BentoInfo from "../shared/BentoInfo/BentoInfo";
import UserInfo from "../shared/UserCard/UserCard";
import { ApiService } from "../../services/api.service";
import type { Product } from "../../types/i-product";

const Hero: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [aprovados, setAprovados] = useState<number>(0);
  const [comAvarias, setComAvarias] = useState<number>(0);

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    console.log("Stored products from localStorage:", storedProducts);
    const storedAprovados = localStorage.getItem("aprovados");
    const storedComAvarias = localStorage.getItem("comAvarias");

    if (storedProducts && storedAprovados && storedComAvarias) {
      const parsedProducts = JSON.parse(storedProducts);
      setProducts(parsedProducts);
      setAprovados(Number(storedAprovados));
      setComAvarias(Number(storedComAvarias));
      console.log("Loaded products from localStorage", parsedProducts);
    const {
      aprovados: aprovados2,
      avarias: avarias2,
      tipo,
      range,
    } = ApiService.queryIndicatorsByHourAndDay(
      "Embalagem_Boa",
      7,
      8,
      new Date("2025-09-17"),
      parsedProducts
    );
      console.log(
        `Indicadores para ${tipo} no intervalo ${range}: Aprovados=${aprovados2}, Avarias=${avarias2}`
      );
    } else {
      ApiService.getProducts()
        .then((p) => {
          setProducts(p);
          const { aprovados, avarias } = ApiService.getAprovedProducts(p);
          setAprovados(aprovados);
          setComAvarias(avarias);
          localStorage.setItem("products", JSON.stringify(p));
          localStorage.setItem("aprovados", aprovados.toString());
          localStorage.setItem("comAvarias", avarias.toString());
        })
        .catch((err) => console.error(err));
    }
    
  }, []);

  console.log("Aprovados:", aprovados);
  console.log("Com Avarias:", comAvarias);

  const totalAnalyses = products.length;
  const approvedCount = products.filter((p) => p.status === "aprovado").length;
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
    const day = new Date(p.data).toISOString().split("T")[0];
    const idx = labels.indexOf(day);
    if (idx >= 0) counts[idx] += 1;
  });

  // gráfico removido: usamos BentoInfo para métricas diárias/mensais

  const BentoInfoProps = {
    header: "Análises Totais",
    infoValue: totalAnalyses,
    percentageValue: approvalRate,
    icon: ChartScatterIcon,
    iconProps: { size: 40, weight: "fill" } as IconProps,
  };

  const UserInfoProps = {
    header: "Lucas",
    icon: UserIcon,
    iconProps: { size: 40, weight: "fill" } as IconProps,
    aprovados: aprovados,
    comAvarias: comAvarias,
  };

  return (
    <section className="section-hero items-center justify-center">
      <div className="grid grid-cols-3 grid-rows-auto gap-4 w-full h-full">
        <UserInfo
          {...UserInfoProps}
          className="col-start-1 col-end-2 row-start-1 row-end-4 w-full h-full min-h-0 min-w-0 flex flex-col"
        />
        <BentoInfo
          {...BentoInfoProps}
          gridColumn="col-start-2 col-end-3"
          gridRow="row-start-1 row-end-2"
        />
        <BentoInfo
          header="Taxa de aprovação"
          infoValue={approvalRate}
          percentageValue={approvalRate}
          icon={ChartScatterIcon}
          iconProps={{ size: 40, weight: "fill" } as IconProps}
          gridColumn="col-start-3 col-end-4"
          gridRow="row-start-1 row-end-2"
        />
        <BentoInfo
          header="Análises Diárias"
          infoValue={(() => {
            const todayStr = new Date().toISOString().split("T")[0];
            return products.filter(
              (p) => new Date(p.data).toISOString().split("T")[0] === todayStr
            ).length;
          })()}
          percentageValue={0}
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
                d.getUTCFullYear() === now.getUTCFullYear() &&
                d.getUTCMonth() === now.getUTCMonth()
              );
            }).length;
          })()}
          percentageValue={0}
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
