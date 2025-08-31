import React from "react";
import "./styles.css";
import {
  ArrowCircleRightIcon,
  ChartScatterIcon,
  UserIcon,
  type IconProps,
} from "@phosphor-icons/react";
import BentoInfo from "../shared/BentoInfo/BentoInfo";
import UserInfo from "../shared/UserCard/UserCard";
import MockLineChart from "../shared/LineChart/LineChart";

const BentoInfoProps = {
  header: "Número de Análises",
  infoValue: 40,
  percentageValue: 50,
  icon: ChartScatterIcon,
  iconProps: { size: 48, weight: "fill" } as IconProps,
};

const UserInfoProps = {
  header: "Lucas",
  icon: UserIcon,
  iconProps: { size: 48, weight: "fill" } as IconProps,
};

const Hero: React.FC = () => {
  return (
    <section className="section-hero">
      <div className="section-header">
        <h2 className="font-krona text-2xl">Hero</h2>
        <ArrowCircleRightIcon
          size={48}
          weight="fill"
          className="text-orange-700 cursor-pointer"
        />
      </div>
      <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full h-full">
        {/* UserCard ocupa 2 linhas e 1 coluna (esquerda) */}
        <UserInfo
          {...UserInfoProps}
          className="col-start-1 col-end-2 row-start-1 row-end-4 w-full h-full min-h-0 min-w-0 flex flex-col"
        />
        {/* BentoInfo 1: linha 1, coluna 2 */}
        <BentoInfo
          {...BentoInfoProps}
          header="Número de Análises"
          gridColumn="col-start-2 col-end-3"
          gridRow="row-start-1 row-end-2"
        />
        {/* BentoInfo 2: linha 1, coluna 3 */}
        <BentoInfo
          {...BentoInfoProps}
          header="Outro Info"
          gridColumn="col-start-3 col-end-4"
          gridRow="row-start-1 row-end-2"
        />
        {/* Gráfico ocupa o restante do grid (2 colunas x 2 linhas) */}
        <div className="col-start-2 col-end-4 row-start-2 row-end-4 w-full h-full bg-[#fffdfa] rounded-lg shadow p-6 flex flex-col min-w-0 min-h-0">
          <MockLineChart />
        </div>
      </div>
    </section>
  );
};

export default Hero;
