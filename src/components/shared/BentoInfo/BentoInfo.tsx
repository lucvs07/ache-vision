import React from "react";
import "./styles.css";
import { type IconProps } from "@phosphor-icons/react";

type BentoInfoProps = {
  header: string;
  infoValue: number;
  percentageValue: number;
  icon: React.ElementType<IconProps>;
  iconProps?: IconProps;
};

const BentoInfo: React.FC<BentoInfoProps> = ({
  header,
  infoValue,
  percentageValue,
  icon: Icon,
  iconProps,
}) => {
  return (
    <div className="bento-box">
      <div className="bento-header">
        <span>{header}</span>
        <Icon {...iconProps} size={32}/>
      </div>
      <div className="bento-content">
        <span>{infoValue}</span>
        <span>{percentageValue}</span>
      </div>
    </div>
  );
};

export default BentoInfo;
