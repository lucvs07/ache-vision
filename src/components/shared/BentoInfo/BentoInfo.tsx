import React from "react";
import "./styles.css";
import { type IconProps } from "@phosphor-icons/react";

type BentoInfoProps = {
  header: string;
  infoValue: number;
  percentageValue: number;
  icon: React.ElementType<IconProps>;
  iconProps?: IconProps;
  colSpan: string;
  rowSpan: string;
};

const BentoInfo: React.FC<BentoInfoProps> = ({
  header,
  infoValue,
  percentageValue,
  icon: Icon,
  iconProps,
  colSpan,
  rowSpan,
}) => {
  return (
    <div className={`bento-box col-span-${colSpan} row-span-${rowSpan}`}>
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
