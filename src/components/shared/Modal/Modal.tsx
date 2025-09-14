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
        className="bg-white-50 p-6 rounded-md shadow-lg min-w-[300px]"
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
              src={props.imgLabel}
              alt={props.tipo + "Com Label"}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={props.imgNormal}
              alt={props.tipo + "Sem Label"}
            />
          }
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
