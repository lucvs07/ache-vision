import React from "react";
import type { Product } from "../../../types/i-product";
import "./styles.css";
import {
  SealCheckIcon,
  SealQuestionIcon,
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

const mapStatus = {
  aprovado: { theme: "text-success-800", icon: SealCheckIcon },
  verificar: { theme: "text-warning-800", icon: SealQuestionIcon },
  rejeitado: { theme: "text-danger-800", icon: SealWarningIcon },
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
  const IconComponent =
    mapStatus[props.status as keyof typeof mapStatus].icon || SealQuestionIcon;
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
              className={
                mapStatus[props.status as keyof typeof mapStatus].theme
              }
            />
            <span
              className={
                mapStatus[props.status as keyof typeof mapStatus].theme
              }
            >
              {ApiService.formatLabel(props.tipo)}
            </span>
          </div>
          <div className="data-content">
            <span>{ApiService.formatDateToBR(props.data)}</span>
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
