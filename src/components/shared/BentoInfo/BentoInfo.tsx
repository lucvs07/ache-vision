import React from "react";
import "./styles.css";
import { type IconProps } from "@phosphor-icons/react";

type BentoInfoProps = {
  header: string;
  infoValue: number | string;
  percentageValue?: number;
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
  
  const showPercentage = percentageValue !== undefined;
  
  return (
    <div className={`bento-box ${gridClasses}`}>
      <div className="bento-header">
        <span>{header}</span>
        <Icon {...iconProps} />
      </div>
      <div className="bento-content">
        <span className={showPercentage ? "" : "no-percentage"}>{infoValue}</span>
        {showPercentage && (
          <span className="percentage-badge">{percentageValue}%</span>
        )}
      </div>
    </div>
  );
};

export default BentoInfo;
