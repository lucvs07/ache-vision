import React from "react";
import "./styles.css";
import type { Product } from "../../../types/i-product";
import { ApiService } from "../../../services/api.service";
import {
  InfoIcon,
  PackageIcon,
  SealCheckIcon,
  SealWarningIcon,
} from "@phosphor-icons/react";

// Determina se o produto está aprovado ou defeituoso com base no tipo
const isProductApproved = (tipo: string): boolean => {
  const tiposAprovados = [
    "Frasco_Completo",
    "Embalagem_Boa", 
    "Blister_Completo"
  ];
  return tiposAprovados.some(t => tipo.toLowerCase() === t.toLowerCase());
};

const sealStatus = {
  aprovado: SealCheckIcon,
  defeituoso: SealWarningIcon,
};

const themeStatus = {
  aprovado: "text-success-800",
  defeituoso: "text-danger-800",
};

interface CardProps extends Product {
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ veracidade, tipo, onClick, ...rest }) => {
  const currentStatus = isProductApproved(tipo) ? "aprovado" : "defeituoso";
  const IconComponent = sealStatus[currentStatus];
  
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
          className={themeStatus[currentStatus]}
        />
        <p
          className={`card-description font-krona ${themeStatus[currentStatus]}`}
        >
          {ApiService.formatLabel(tipo)}
        </p>
        <p className="text-xs text-black-600 mt-1">
          Confiança: <span className="font-bold">{veracidade}</span>
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
