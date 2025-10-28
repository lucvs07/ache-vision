/**
 * Utilitários para determinar o status de produtos com base no tipo
 */

/**
 * Tipos de embalagens considerados aprovados (sem defeito)
 */
const TIPOS_APROVADOS = [
  "Frasco_Completo",
  "Embalagem_Boa",
  "Blister_Completo",
] as const;

/**
 * Determina se um produto está aprovado com base no tipo
 * 
 * Regra de negócio: Apenas produtos com tipos específicos são aprovados:
 * - Frasco_Completo
 * - Embalagem_Boa
 * - Blister_Completo
 * 
 * Qualquer outro tipo é considerado defeituoso
 * 
 * @param tipo - Tipo do produto (ex: "Frasco_Completo", "Frasco_Incompleto", etc)
 * @returns true se aprovado, false se defeituoso
 */
export const isProductApproved = (tipo: string): boolean => {
  return TIPOS_APROVADOS.some(
    (t) => tipo.toLowerCase() === t.toLowerCase()
  );
};

/**
 * Retorna o status do produto baseado no tipo
 * 
 * @param tipo - Tipo do produto
 * @returns "aprovado" ou "defeituoso"
 */
export const getProductStatus = (
  tipo: string
): "aprovado" | "defeituoso" => {
  return isProductApproved(tipo) ? "aprovado" : "defeituoso";
};

/**
 * Retorna a label formatada do status
 * 
 * @param tipo - Tipo do produto
 * @returns Label formatada (ex: "✓ Aprovado", "✗ Defeituoso")
 */
export const getProductStatusLabel = (tipo: string): string => {
  return isProductApproved(tipo) ? "✓ Aprovado" : "✗ Defeituoso";
};
