export interface OEEMetrics {
  qualidade: number;        // 0-100%
  performance: number;      // 0-100%
  disponibilidade: number;  // 0-100%
  oeeTotal: number;         // 0-100%
  periodo: {
    inicio: Date;
    fim: Date;
  };
  detalhes: {
    totalAnalises: number;
    aprovados: number;
    rejeitados: number;
    analisePorHora: number;
    horasAtivas: number;
    horasPlanejadasTurno: number;
  };
}

export interface OEEConfig {
  metaAnalisePorHora: number;     // Ex: 100 ou 3.5 (3 análises e meia por hora) - Suporta decimais
  horasTurno: number;             // Ex: 8 ou 2.5 (2h30min) ou 0.33 (20min)
  turnoInicio: number;            // Ex: 7 (7h) ou 9.5 (9h30min) - formato decimal
  turnoFim: number;               // Ex: 15 (15h) ou 17.75 (17h45min) - formato decimal
  limiteGapParada: number;        // Minutos sem análise = parada
}

export const DEFAULT_OEE_CONFIG: OEEConfig = {
  metaAnalisePorHora: 40,
  horasTurno: 0.33,
  turnoInicio: 9,          // 8h00
  turnoFim: 9.33,            // 10h00
  limiteGapParada: 15
};

/**
 * Converte hora decimal para hora e minutos
 * Exemplo: 9.5 → { hora: 9, minuto: 30 }
 */
export function decimalParaHoraMinuto(decimal: number): { hora: number; minuto: number } {
  const hora = Math.floor(decimal);
  const minuto = Math.round((decimal - hora) * 60);
  return { hora, minuto };
}

/**
 * Converte hora e minutos para decimal
 * Exemplo: 9h30 → 9.5
 */
export function horaMinutoParaDecimal(hora: number, minuto: number): number {
  return hora + (minuto / 60);
}

export const OEE_BENCHMARKS = {
  WORLD_CLASS: 85,
  GOOD: 60,
  ACCEPTABLE: 40,
  POOR: 0
};
