import React from "react";
import "./styles.css";
import type { Product } from "../../../types/i-product";
import { ApiService } from "../../../services/api.service";
import {
  InfoIcon,
  PackageIcon,
  SealCheckIcon,
  SealQuestionIcon,
  SealWarningIcon,
} from "@phosphor-icons/react";
const sealStatus = {
  aprovado: SealCheckIcon,
  verificar: SealQuestionIcon,
  rejeitado: SealWarningIcon,
};
const themeStatus = {
  aprovado: "text-success-800",
  verificar: "text-warning-800",
  rejeitado: "text-danger-800",
};

interface CardProps extends Product {
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ veracidade, tipo, onClick, ...rest }) => {
  const IconComponent =
    sealStatus[rest.status as keyof typeof sealStatus] || SealQuestionIcon;
  return (
    <div className="card">
      <div className="card-header">
        <PackageIcon
          size={32}
          weight="fill"
          className="text-white-50"
        ></PackageIcon>
        <span>
          {ApiService.formatDateToBR(rest.data)}
        </span>
      </div>
      <div className="card-content">
        <IconComponent
          size={56}
          weight="fill"
          className={themeStatus[rest.status as keyof typeof themeStatus]}
        />
        <p
          className={`card-description font-krona ${
            themeStatus[rest.status as keyof typeof themeStatus]
          }`}
        >
          {veracidade} {tipo}
        </p>
      </div>
      <div className="card-footer">
        <InfoIcon
          size={32}
          weight="fill"
          className="icon-info"
          onClick={onClick}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default Card;
