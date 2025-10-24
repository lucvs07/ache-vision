import type { Product } from "../types/i-product";
import type { OEEMetrics, OEEConfig } from "../types/i-oee";

export class OEEService {
  /**
   * Calcula a Qualidade (Quality)
   * Qualidade = (Produtos Aprovados / Total de Produtos) × 100
   */
  static calcularQualidade(products: Product[]): number {
    if (products.length === 0) return 0;
    const aprovados = products.filter(p => p.status === "aprovado").length;
    return (aprovados / products.length) * 100;
  }

  /**
   * Calcula horas ativas baseado em gaps entre análises
   * Se gap > limiteGapParada, considera como parada
   */
  static calcularHorasAtivas(
    products: Product[],
    config: OEEConfig
  ): number {
    if (products.length < 2) return products.length > 0 ? 0.1 : 0;

    const sorted = [...products].sort((a, b) =>
      new Date(a.data).getTime() - new Date(b.data).getTime()
    );

    let horasAtivas = 0;
    const limiteGapMs = config.limiteGapParada * 60 * 1000;

    for (let i = 1; i < sorted.length; i++) {
      const gap = new Date(sorted[i].data).getTime() -
        new Date(sorted[i - 1].data).getTime();

      if (gap <= limiteGapMs) {
        horasAtivas += gap / (1000 * 60 * 60);
      }
    }

    // Considera pelo menos o tempo mínimo se houver produtos
    return Math.max(horasAtivas, 0.1);
  }

  /**
   * Calcula a Performance
   * Performance = (Análises Realizadas / Análises Esperadas) × 100
   * Análises Esperadas = Meta por Hora × Horas Ativas
   */
  static calcularPerformance(
    products: Product[],
    config: OEEConfig,
    horasOperacao: number
  ): number {
    if (horasOperacao === 0) return 0;
    
    const analisesPorHora = products.length / horasOperacao;
    const performance = (analisesPorHora / config.metaAnalisePorHora) * 100;
    
    // Limita a 100% para não ultrapassar meta
    return Math.min(performance, 100);
  }

  /**
   * Calcula a Disponibilidade
   * Disponibilidade = (Horas Ativas / Horas Planejadas) × 100
   */
  static calcularDisponibilidade(
    products: Product[],
    config: OEEConfig
  ): number {
    const horasComAtividade = this.calcularHorasAtivas(products, config);
    const disponibilidade = (horasComAtividade / config.horasTurno) * 100;
    
    // Limita a 100%
    return Math.min(disponibilidade, 100);
  }

  /**
   * Calcula todos os indicadores OEE
   */
  static calcularOEE(
    products: Product[],
    config: OEEConfig,
    periodo: { inicio: Date; fim: Date }
  ): OEEMetrics {
    const qualidade = this.calcularQualidade(products);
    const horasOperacao = this.calcularHorasAtivas(products, config);
    const performance = this.calcularPerformance(products, config, horasOperacao);
    const disponibilidade = this.calcularDisponibilidade(products, config);

    // OEE = Qualidade × Performance × Disponibilidade (tudo em decimal)
    const oeeTotal = (qualidade / 100) * (performance / 100) * (disponibilidade / 100) * 100;

    return {
      qualidade: Math.round(qualidade * 100) / 100,
      performance: Math.round(performance * 100) / 100,
      disponibilidade: Math.round(disponibilidade * 100) / 100,
      oeeTotal: Math.round(oeeTotal * 100) / 100,
      periodo,
      detalhes: {
        totalAnalises: products.length,
        aprovados: products.filter(p => p.status === "aprovado").length,
        rejeitados: products.filter(p => p.status !== "aprovado").length,
        analisePorHora: Math.round((products.length / horasOperacao) * 100) / 100,
        horasAtivas: Math.round(horasOperacao * 100) / 100,
        horasPlanejadasTurno: config.horasTurno
      }
    };
  }

  /**
   * Filtra produtos por período
   */
  static filtrarPorPeriodo(
    products: Product[],
    inicio: Date,
    fim: Date
  ): Product[] {
    return products.filter(p => {
      const data = new Date(p.data);
      return data >= inicio && data <= fim;
    });
  }

  /**
   * Filtra produtos por dia específico
   */
  static filtrarPorDia(
    products: Product[],
    dia: Date
  ): Product[] {
    const diaStr = dia.toISOString().split('T')[0];
    return products.filter(p => {
      const produtoData = new Date(p.data).toISOString().split('T')[0];
      return produtoData === diaStr;
    });
  }

  /**
   * Filtra produtos por turno em um dia específico
   * Suporta horários com minutos usando formato decimal
   * Exemplo: 9.5 = 9h30min
   */
  static filtrarPorTurno(
    products: Product[],
    dia: Date,
    config: OEEConfig
  ): Product[] {
    const diaStr = dia.toISOString().split('T')[0];
    
    return products.filter(p => {
      const data = new Date(p.data);
      const produtoData = data.toISOString().split('T')[0];
      
      // Converte hora e minutos para decimal
      const hour = data.getUTCHours();
      const minute = data.getUTCMinutes();
      const hourDecimal = hour + (minute / 60);
      
      return produtoData === diaStr && 
             hourDecimal >= config.turnoInicio && 
             hourDecimal < config.turnoFim;
    });
  }

  /**
   * Obtém cor do indicador baseado no valor
   * Usa variáveis CSS do tema definidas em index.css
   */
  static getCorIndicador(valor: number, tipo: 'oee' | 'other'): string {
    // Obtém as cores das variáveis CSS
    const root = document.documentElement;
    const successColor = getComputedStyle(root).getPropertyValue('--color-success-800').trim() || '#10b981';
    const warningColor = getComputedStyle(root).getPropertyValue('--color-warning-800').trim() || '#f59e0b';
    const dangerColor = getComputedStyle(root).getPropertyValue('--color-danger-800').trim() || '#ef4444';
    
    if (tipo === 'oee') {
      if (valor >= 85) return successColor;
      if (valor >= 60) return warningColor;
      if (valor >= 40) return warningColor;
      return dangerColor;
    } else {
      if (valor >= 90) return successColor;
      if (valor >= 75) return warningColor;
      if (valor >= 50) return warningColor;
      return dangerColor;
    }
  }

  /**
   * Obtém classificação textual do OEE
   */
  static getClassificacaoOEE(valor: number): string {
    if (valor >= 85) return 'Classe Mundial';
    if (valor >= 60) return 'Bom';
    if (valor >= 40) return 'Aceitável';
    return 'Necessita Melhoria';
  }
}
