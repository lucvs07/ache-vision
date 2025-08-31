import React from "react";
import "./styles.css";
import { ArrowCircleRightIcon, ChartScatterIcon, UserIcon, type IconProps} from "@phosphor-icons/react";
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
      <div className="bento-grid">
        <UserInfo {...UserInfoProps} colSpan={1} rowSpan={2} />
        <BentoInfo {...BentoInfoProps} colSpan={"1"} rowSpan={"1"} />
        <BentoInfo {...BentoInfoProps} colSpan={"1"} rowSpan={"1"} />
        <MockLineChart />
      </div>
    </section>
  );
};

export default Hero;
