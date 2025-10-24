# 📊 MVP - Indicadores OEE

## ✅ Implementado

### 1. **Tipos e Interfaces** (`src/types/i-oee.ts`)
- Interface `OEEMetrics` com todos os indicadores
- Interface `OEEConfig` para configuração do sistema
- Configuração padrão com benchmarks OEE

### 2. **Serviço de Cálculo** (`src/services/oee.service.ts`)
Implementa os 3 pilares do OEE:

#### **Qualidade**
```
Qualidade = (Produtos Aprovados / Total) × 100
```
- Usa o campo `status === "aprovado"` da API

#### **Performance**
```
Performance = (Análises/Hora Real / Meta) × 100
```
- Meta configurável: 50 análises/hora (padrão)
- Calcula horas ativas baseado em gaps entre análises

#### **Disponibilidade**
```
Disponibilidade = (Horas Ativas / Horas Planejadas) × 100
```
- Detecta paradas: gaps > 10 minutos sem análises
- Turno padrão: 7h às 15h (8 horas)

#### **OEE Total**
```
OEE = Qualidade × Performance × Disponibilidade
```

### 3. **Componentes UI**

#### `OEECard` 
Card com métrica, valor, progresso e meta

#### `OEEGauge`
Medidor semicircular SVG com animação

### 4. **Página OEE** (`src/pages/OEE.tsx`)

**Funcionalidades:**
- ✅ Filtros: Hoje / Ontem / Últimos 7 Dias
- ✅ Gauge principal do OEE Total
- ✅ Cards dos 3 pilares (Qualidade, Performance, Disponibilidade)
- ✅ Detalhes de análises, operação e configuração
- ✅ Loading state
- ✅ Estado vazio (sem dados)
- ✅ Sistema de cores baseado em performance
- ✅ Classificação: Classe Mundial / Bom / Aceitável / Necessita Melhoria

**Layout:**
```
┌────────────────────────────────────────┐
│  Título | [Hoje][Ontem][Últimos 7]    │
├────────────────────────────────────────┤
│         OEE TOTAL: 75.2%               │
│          (Gauge Grande)                │
├──────────┬──────────┬──────────────────┤
│Qualidade │Performance│Disponibilidade  │
│  89.5%   │  92.1%    │    91.5%        │
├──────────┴──────────┴──────────────────┤
│  Análises | Operação | Configuração   │
│  Detalhes | Detalhes | Detalhes       │
└────────────────────────────────────────┘
```

## 🎨 Design

- **Cores dinâmicas** baseadas em performance:
  - Verde (≥85%): Classe Mundial
  - Amarelo (≥60%): Bom
  - Laranja (≥40%): Aceitável
  - Vermelho (<40%): Necessita Melhoria

- **Responsivo**: Adapta para mobile
- **Animações**: Transições suaves nos gauges e cards

## ⚙️ Configuração Padrão

```typescript
{
  metaAnalisePorHora: 50,      // 50 análises/hora
  horasTurno: 8,                // 8 horas de turno
  turnoInicio: 7,               // 7h da manhã
  turnoFim: 15,                 // 15h (3pm)
  limiteGapParada: 10           // 10 min = parada
}
```

## 🚀 Como Usar

1. Acesse a página via sidebar: botão "OEE"
2. Selecione o período: Hoje / Ontem / Últimos 7 Dias
3. Visualize os indicadores:
   - **OEE Total**: Meta ≥85% (Classe Mundial)
   - **Qualidade**: Meta ≥90%
   - **Performance**: Meta ≥85%
   - **Disponibilidade**: Meta ≥95%

## 📈 Próximas Melhorias

- [ ] Gráfico de tendência temporal
- [ ] Breakdown por tipo de produto (Embalagem/Blister/Frasco)
- [ ] Exportar relatório PDF
- [ ] Configuração editável de metas
- [ ] Análise de perdas (Six Big Losses)
- [ ] Comparativo entre períodos
- [ ] Alertas automáticos quando OEE < meta

## 🔍 Dados Utilizados da API

```json
{
  "data": "timestamp",      // ✅ Análise temporal
  "status": "aprovado",     // ✅ Cálculo de Qualidade
  "tipo": "Embalagem_Boa"   // ✅ Categorização
}
```

## 🎯 Benchmarks OEE

- **≥85%**: Classe Mundial (Verde)
- **60-85%**: Bom (Amarelo)
- **40-60%**: Aceitável (Laranja)
- **<40%**: Necessita Melhoria (Vermelho)
