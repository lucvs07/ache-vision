import React from "react";
import "./styles.css";
import { type IconProps } from "@phosphor-icons/react";

type BentoInfoProps = {
  header: string;
  infoValue: number;
  percentageValue: number;
  icon: React.ElementType<IconProps>;
  iconProps?: IconProps;
  gridColumn?: string;
  gridRow?: string;
};

const BentoInfo: React.FC<BentoInfoProps> = ({
  header,
  infoValue,
  percentageValue,
  icon: Icon,
  iconProps,
  gridColumn,
  gridRow,
}) => {
  // Monta as classes de grid do Tailwind
  const gridClasses = [
    gridColumn ? gridColumn : "",
    gridRow ? gridRow : "",
    "w-full h-full",
  ].join(" ");
  return (
    <div className={`bento-box ${gridClasses}`}>
      <div className="bento-header">
        <span>{header}</span>
        <Icon {...iconProps} />
      </div>
      <div className="bento-content">
        <span>{infoValue}</span>
        <span>{percentageValue}%</span>
      </div>
    </div>
  );
};

export default BentoInfo;
