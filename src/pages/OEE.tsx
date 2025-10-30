import React, { useEffect, useState } from "react";
import { ApiService } from "../services/api.service";
import { OEEService } from "../services/oee.service";
import type { Product } from "../types/i-product";
import type { OEEMetrics } from "../types/i-oee";
import { DEFAULT_OEE_CONFIG, decimalParaHoraMinuto } from "../types/i-oee";
import OEECard from "../components/shared/OEECard/OEECard";
import OEEGauge from "../components/shared/OEEGauge/OEEGauge";
import "./oee.css";

const OEE: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [oeeMetrics, setOeeMetrics] = useState<OEEMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<"hoje" | "ontem" | "ultimos7dias">("hoje");

  useEffect(() => {
    loadData();
  }, [periodo]);

  const loadData = async () => {
    try {
      setLoading(true);
      const allProducts = await ApiService.getProducts();
      
      let produtosFiltrados: Product[] = [];
      let inicio: Date;
      let fim: Date;
      const hoje = new Date();
      
      switch (periodo) {
        case "hoje":
          produtosFiltrados = OEEService.filtrarPorDia(allProducts, hoje);
          inicio = new Date(hoje);
          inicio.setHours(DEFAULT_OEE_CONFIG.turnoInicio, 0, 0, 0);
          fim = new Date(hoje);
          fim.setHours(DEFAULT_OEE_CONFIG.turnoFim, 0, 0, 0);
          break;
          
        case "ontem":
          const ontem = new Date(hoje);
          ontem.setDate(ontem.getDate() - 1);
          produtosFiltrados = OEEService.filtrarPorDia(allProducts, ontem);
          inicio = new Date(ontem);
          inicio.setHours(DEFAULT_OEE_CONFIG.turnoInicio, 0, 0, 0);
          fim = new Date(ontem);
          fim.setHours(DEFAULT_OEE_CONFIG.turnoFim, 0, 0, 0);
          break;
          
        case "ultimos7dias":
          const seteDiasAtras = new Date(hoje);
          seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
          produtosFiltrados = OEEService.filtrarPorPeriodo(
            allProducts,
            seteDiasAtras,
            hoje
          );
          inicio = seteDiasAtras;
          fim = hoje;
          break;
      }
      
      setProducts(produtosFiltrados);
      
      if (produtosFiltrados.length > 0) {
        const metrics = OEEService.calcularOEE(
          produtosFiltrados,
          DEFAULT_OEE_CONFIG,
          { inicio, fim }
        );
        setOeeMetrics(metrics);
      } else {
        setOeeMetrics(null);
      }
      
    } catch (error) {
      console.error("Erro ao carregar dados OEE:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodoTexto = () => {
    switch (periodo) {
      case "hoje":
        return "Hoje";
      case "ontem":
        return "Ontem";
      case "ultimos7dias":
        return "Últimos 7 Dias";
    }
  };

  if (loading) {
    return (
      <div className="oee-container">
        <div className="oee-loading">
          <div className="oee-spinner"></div>
          <p>Carregando indicadores OEE...</p>
        </div>
      </div>
    );
  }

  if (!oeeMetrics || products.length === 0) {
    return (
      <div className="oee-container">
        <div className="oee-header">
          <div>
            <h1 className="oee-title">Indicadores OEE</h1>
            <p className="oee-subtitle">Overall Equipment Effectiveness</p>
          </div>
          <div className="oee-filters">
            <button
              className={periodo === "hoje" ? "oee-filter-btn active" : "oee-filter-btn"}
              onClick={() => setPeriodo("hoje")}
            >
              Hoje
            </button>
            <button
              className={periodo === "ontem" ? "oee-filter-btn active" : "oee-filter-btn"}
              onClick={() => setPeriodo("ontem")}
            >
              Ontem
            </button>
            <button
              className={periodo === "ultimos7dias" ? "oee-filter-btn active" : "oee-filter-btn"}
              onClick={() => setPeriodo("ultimos7dias")}
            >
              Últimos 7 Dias
            </button>
          </div>
        </div>
        
        <div className="oee-no-data">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Sem dados para o período selecionado
          </h2>
          <p className="text-gray-500">
            Não há análises registradas para {getPeriodoTexto().toLowerCase()}
          </p>
        </div>
      </div>
    );
  }

  const corOEE = OEEService.getCorIndicador(oeeMetrics.oeeTotal, 'oee');
  const corQualidade = OEEService.getCorIndicador(oeeMetrics.qualidade, 'other');
  const corPerformance = OEEService.getCorIndicador(oeeMetrics.performance, 'other');
  const corDisponibilidade = OEEService.getCorIndicador(oeeMetrics.disponibilidade, 'other');

  // Formata horários para exibição
  const formatarHorario = (decimal: number): string => {
    const { hora, minuto } = decimalParaHoraMinuto(decimal);
    return minuto > 0 ? `${hora}h${minuto.toString().padStart(2, '0')}` : `${hora}h`;
  };

  // Formata duração em horas para exibição (ex: 0.33h = 20min, 2.5h = 2h30)
  const formatarDuracao = (horas: number): string => {
    const horasInteiras = Math.floor(horas);
    const minutos = Math.round((horas - horasInteiras) * 60);
    
    if (horasInteiras === 0 && minutos > 0) {
      return `${minutos}min`;
    } else if (minutos === 0) {
      return `${horasInteiras}h`;
    } else {
      return `${horasInteiras}h${minutos.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div className="oee-container">
      {/* Header com filtros */}
      <div className="oee-header">
        <div>
          <h1 className="oee-title">Indicadores OEE</h1>
          <p className="oee-subtitle">
            {getPeriodoTexto()} - {OEEService.getClassificacaoOEE(oeeMetrics.oeeTotal)}
          </p>
          <p className="text-xs text-black-600 mt-2 italic">
            💡 Mede a eficiência da <strong>linha de produção</strong>. Qualidade baseada no tipo de embalagem detectado (Frasco_Completo, Embalagem_Boa, Blister_Completo = aprovado).
          </p>
        </div>
        <div className="oee-filters">
          <button
            className={periodo === "hoje" ? "oee-filter-btn active" : "oee-filter-btn"}
            onClick={() => setPeriodo("hoje")}
          >
            Hoje
          </button>
          <button
            className={periodo === "ontem" ? "oee-filter-btn active" : "oee-filter-btn"}
            onClick={() => setPeriodo("ontem")}
          >
            Ontem
          </button>
          <button
            className={periodo === "ultimos7dias" ? "oee-filter-btn active" : "oee-filter-btn"}
            onClick={() => setPeriodo("ultimos7dias")}
          >
            Últimos 7 Dias
          </button>
        </div>
      </div>

      {/* Indicador OEE Principal */}
      <div className="oee-main-gauge">
        <div className="oee-gauge-card">
          <OEEGauge
            valor={oeeMetrics.oeeTotal}
            titulo="OEE TOTAL"
            cor={corOEE}
            tamanho={220}
          />
          <div className="oee-gauge-info">
            <p className="oee-gauge-classification">
              {OEEService.getClassificacaoOEE(oeeMetrics.oeeTotal)}
            </p>
            <p className="oee-gauge-description">
              Qualidade × Performance × Disponibilidade
            </p>
          </div>
        </div>
      </div>

      {/* Cards dos 3 pilares */}
      <div className="oee-pillars-grid">
        <OEECard
          titulo="Qualidade"
          valor={oeeMetrics.qualidade}
          meta={90}
          cor={corQualidade}
          descricao="% de embalagens sem defeito (Frasco_Completo, Embalagem_Boa, Blister_Completo)"
        />
        <OEECard
          titulo="Performance"
          valor={oeeMetrics.performance}
          meta={85}
          cor={corPerformance}
          descricao="Taxa de produção real vs ideal"
        />
        <OEECard
          titulo="Disponibilidade"
          valor={oeeMetrics.disponibilidade}
          meta={95}
          cor={corDisponibilidade}
          descricao="Tempo ativo vs tempo planejado"
        />
      </div>

      {/* Detalhes */}
      <div className="oee-details-grid">
        <div className="oee-detail-card">
          <h3 className="oee-detail-title">Análises</h3>
          <div className="oee-detail-content">
            <div className="oee-detail-item">
              <span className="oee-detail-label">Total:</span>
              <span className="oee-detail-value">{oeeMetrics.detalhes.totalAnalises}</span>
            </div>
            <div className="oee-detail-item">
              <span className="oee-detail-label">✓ Sem Defeito:</span>
              <span className="oee-detail-value" style={{ color: '#10b981' }}>
                {oeeMetrics.detalhes.aprovados}
              </span>
            </div>
            <div className="oee-detail-item">
              <span className="oee-detail-label">✗ Com Defeito:</span>
              <span className="oee-detail-value" style={{ color: '#ef4444' }}>
                {oeeMetrics.detalhes.rejeitados}
              </span>
            </div>
          </div>
        </div>

        <div className="oee-detail-card">
          <h3 className="oee-detail-title">Operação</h3>
          <div className="oee-detail-content">
            <div className="oee-detail-item">
              <span className="oee-detail-label">Análises/Hora:</span>
              <span className="oee-detail-value">{oeeMetrics.detalhes.analisePorHora}</span>
            </div>
            <div className="oee-detail-item">
              <span className="oee-detail-label">Meta/Hora:</span>
              <span className="oee-detail-value">{DEFAULT_OEE_CONFIG.metaAnalisePorHora}</span>
            </div>
            <div className="oee-detail-item">
              <span className="oee-detail-label">Horas Ativas:</span>
              <span className="oee-detail-value">{oeeMetrics.detalhes.horasAtivas}h</span>
            </div>
          </div>
        </div>

        <div className="oee-detail-card">
          <h3 className="oee-detail-title">Configuração</h3>
          <div className="oee-detail-content">
            <div className="oee-detail-item">
              <span className="oee-detail-label">Turno:</span>
              <span className="oee-detail-value">
                {formatarHorario(DEFAULT_OEE_CONFIG.turnoInicio)} - {formatarHorario(DEFAULT_OEE_CONFIG.turnoFim)}
              </span>
            </div>
            <div className="oee-detail-item">
              <span className="oee-detail-label">Período Planejadas:</span>
              <span className="oee-detail-value">{formatarDuracao(DEFAULT_OEE_CONFIG.horasTurno)}</span>
            </div>
            <div className="oee-detail-item">
              <span className="oee-detail-label">Gap Parada:</span>
              <span className="oee-detail-value">{DEFAULT_OEE_CONFIG.limiteGapParada} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OEE;
