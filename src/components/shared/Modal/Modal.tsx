import React from "react";
import type { Product } from "../../../types/i-product";
import "./styles.css";
import {
  SealCheckIcon,
  SealQuestionIcon,
  SealWarningIcon,
} from "@phosphor-icons/react";

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
        <IconComponent
          size={56}
          weight="fill"
          className={mapStatus[props.status as keyof typeof mapStatus].theme}
        />
        <button
          className="mt-4 px-4 py-2 bg-sunset-500 text-white rounded modal-close"
          onClick={onClose}
        >
          Fechar
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
