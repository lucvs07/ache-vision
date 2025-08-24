import React from "react";
import "./styles.css";
import { ArrowCircleRightIcon, ChartScatterIcon, type IconProps} from "@phosphor-icons/react";
import BentoInfo from "../shared/BentoInfo/BentoInfo";

const BentoInfoProps = {
  header: "Número de Análises",
  infoValue: 40,
  percentageValue: 50,
  icon: ChartScatterIcon,
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
      <BentoInfo {...BentoInfoProps} />
    </div>
    </section>
  );
};

export default Hero;
