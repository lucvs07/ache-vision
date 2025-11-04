export interface Product
{
    id : string;
    data: Date;
    tipo: string;
    aprovado: boolean;
    status: string;
    veracidade: string;
    imgLabel: string;
    imgNormal: string;
    contagem?: string;
    contem?: number;
    faltando?: number;
}
