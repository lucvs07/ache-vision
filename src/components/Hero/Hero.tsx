import React from "react";
import "./styles.css";
import {
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
      <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full h-full">
        <UserInfo
          {...UserInfoProps}
          className="col-start-1 col-end-2 row-start-1 row-end-4 w-full h-full min-h-0 min-w-0 flex flex-col"
        />
        <BentoInfo
          {...BentoInfoProps}
          header="Número de Análises"
          gridColumn="col-start-2 col-end-3"
          gridRow="row-start-1 row-end-2"
        />
        <BentoInfo
          {...BentoInfoProps}
          header="Outro Info"
          gridColumn="col-start-3 col-end-4"
          gridRow="row-start-1 row-end-2"
        />
        <div className="col-start-2 col-end-4 row-start-2 row-end-4 w-full h-full bg-[#fffdfa] rounded-lg shadow p-6 flex flex-col min-w-0 min-h-0">
          <MockLineChart />
        </div>
      </div>
    </section>
  );
};

export default Hero;
