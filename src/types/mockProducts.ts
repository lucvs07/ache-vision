import type { Product } from "../types/i-product";

export const mockProducts: Product[] = [
  {
    id: 1,
    data: new Date(),
    tipo: "Frasco",
    aprovado: true,
    status: "aprovado",
    veracidade: "99%",
    imgLabel: "label1.png",
    imgNormal: "normal1.png",
  },
  {
    id: 2,
    data: new Date(),
    tipo: "Embalagem",
    aprovado: false,
    status: "verificar",
    veracidade: "70%",
    imgLabel: "label2.png",
    imgNormal: "normal2.png",
  },
  {
    id: 3,
    data: new Date(),
    tipo: "Splitter",
    aprovado: false,
    status: "rejeitado",
    veracidade: "50%",
    imgLabel: "label3.png",
    imgNormal: "normal3.png",
  },
];
