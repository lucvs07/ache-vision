import React from "react";
import type { Product } from "../../../types/i-product";
import "./styles.css";
import {
  SealCheckIcon,
  SealWarningIcon,
} from "@phosphor-icons/react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { ApiService } from "../../../services/api.service";

interface ModalProps extends Product {
  open?: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  // ...outras props...
}

// Determina se o produto está aprovado ou defeituoso com base no tipo
const isProductApproved = (tipo: string): boolean => {
  const tiposAprovados = [
    "Frasco_Completo",
    "Embalagem_Boa", 
    "Blister_Completo"
  ];
  return tiposAprovados.some(t => tipo.toLowerCase() === t.toLowerCase());
};

const mapStatus = {
  aprovado: { theme: "text-success-800", icon: SealCheckIcon },
  defeituoso: { theme: "text-danger-800", icon: SealWarningIcon },
};

const Modal: React.FC<ModalProps> = ({
  open = true,
  onClose,
  children,
  ...props
}) => {
  // Transforma uma URL do Cloudinary para aplicar parâmetros de transformação (resize, crop, quality)
  const getCloudinaryUrl = (
    url: string | undefined,
    opts?: { w?: number; h?: number; crop?: string; quality?: string }
  ) => {
    if (!url) return url;
    const defaults = { w: 800, h: 600, crop: "fit", quality: "auto" };
    const { w, h, crop, quality } = { ...defaults, ...(opts || {}) };
    try {
      const parsed = new URL(url);
      // Apenas transforma URLs que contenham o segmento '/upload/' (Cloudinary delivery URL)
      if (!parsed.pathname.includes("/upload/")) return url;
      const [prefix, suffix] = parsed.pathname.split("/upload/");
      const transformSegment = `upload/w_${w},h_${h},c_${crop},q_${quality}`;
      return `${parsed.protocol}//${parsed.host}${prefix}/${transformSegment}/${suffix}`;
    } catch {
      return url;
    }
  };
  
  const currentStatus = isProductApproved(props.tipo) ? "aprovado" : "defeituoso";
  const IconComponent = mapStatus[currentStatus].icon;
  
  // TODO: implement modal content using props
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white-50 p-6 rounded-md shadow-lg min-w-[300px] flex flex-col gap-4 max-w-[90vw] max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="header-modal">
          <div className="label-content">
            <IconComponent
              size={56}
              weight="fill"
              className={mapStatus[currentStatus].theme}
            />
            <span
              className={mapStatus[currentStatus].theme}
            >
              {ApiService.formatLabel(props.tipo)}
            </span>
          </div>
          <div className="data-content">
            <span>{ApiService.formatDateToBR(props.data)}</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-black-700">Confiança:</span>
              <span className={`font-bold ${
                parseInt(props.veracidade) >= 80 ? "text-success-700" :
                parseInt(props.veracidade) >= 60 ? "text-warning-700" :
                "text-danger-700"
              }`}>
                {props.veracidade}
              </span>
            </div>
          </div>
        </div>

        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={
                getCloudinaryUrl(props.imgLabel, { w: 900, h: 600 }) ||
                props.imgLabel
              }
              alt={props.tipo + " Com Label"}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={
                getCloudinaryUrl(props.imgNormal, { w: 900, h: 600 }) ||
                props.imgNormal
              }
              alt={props.tipo + " Sem Label"}
            />
          }
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
