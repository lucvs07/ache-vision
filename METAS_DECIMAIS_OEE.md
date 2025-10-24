# 🎯 Metas Decimais no OEE - Guia Completo

## ✅ Meta de Análise por Hora Aceita Decimais

A configuração `metaAnalisePorHora` agora suporta valores decimais para maior precisão, especialmente útil quando trabalhando com **períodos curtos** (minutos) ou **metas fracionadas**.

---

## 📊 Exemplos de Metas Decimais

| Valor | Significado | Cenário de Uso |
|-------|-------------|----------------|
| `50` | 50 análises/hora | Meta padrão - produção média |
| `100` | 100 análises/hora | Alta produção |
| `3.5` | 3.5 análises/hora | Produção lenta/manual |
| `0.5` | 1 análise a cada 2 horas | Muito baixa produção |
| `120` | 2 análises por minuto | Produção muito rápida |
| `15` | 1 análise a cada 4 minutos | Processo intermediário |

---

## 🧮 Como Calcular Meta para Períodos em Minutos

### **Método 1: Conversão Direta**

Se você sabe quantas análises espera em X minutos:

```typescript
análises_esperadas = 5
minutos_turno = 20

// Converter para análises por HORA:
metaAnalisePorHora = (análises_esperadas / minutos_turno) × 60
metaAnalisePorHora = (5 / 20) × 60 = 15
```

### **Método 2: Análises por Minuto**

Se você sabe a taxa por minuto:

```typescript
análises_por_minuto = 0.25  // 1 análise a cada 4 minutos

// Converter para análises por HORA:
metaAnalisePorHora = análises_por_minuto × 60
metaAnalisePorHora = 0.25 × 60 = 15
```

---

## 📝 Exemplos Práticos

### **Exemplo 1: Turno de 20 minutos, esperando 5 análises**

```typescript
export const DEFAULT_OEE_CONFIG: OEEConfig = {
  metaAnalisePorHora: 15,      // (5 / 20) × 60 = 15
  horasTurno: 0.33,            // 20 minutos = 0.33h
  turnoInicio: 9,
  turnoFim: 9.33,              // 9h20
  limiteGapParada: 10
};
```

**Performance esperada:**
- 5 análises em 20 min = 15 análises/hora
- Se fizer 5 análises → Performance = 100%
- Se fizer 3 análises → Performance = 60%

---

### **Exemplo 2: Turno de 30 minutos, esperando 10 análises**

```typescript
export const DEFAULT_OEE_CONFIG: OEEConfig = {
  metaAnalisePorHora: 20,      // (10 / 30) × 60 = 20
  horasTurno: 0.5,             // 30 minutos
  turnoInicio: 8,
  turnoFim: 8.5,               // 8h30
  limiteGapParada: 5
};
```

---

### **Exemplo 3: Turno de 1 hora, esperando 3.5 análises**

```typescript
export const DEFAULT_OEE_CONFIG: OEEConfig = {
  metaAnalisePorHora: 3.5,     // Meta direta: 3.5 análises/hora
  horasTurno: 1,
  turnoInicio: 14,
  turnoFim: 15,
  limiteGapParada: 15
};
```

---

## 🔢 Tabela de Conversão Rápida

### Para Turnos de 20 Minutos (0.33h):

| Análises Esperadas | Meta/Hora |
|--------------------|-----------|
| 1 | 3 |
| 2 | 6 |
| 3 | 9 |
| 5 | 15 |
| 10 | 30 |
| 15 | 45 |

### Para Turnos de 30 Minutos (0.5h):

| Análises Esperadas | Meta/Hora |
|--------------------|-----------|
| 1 | 2 |
| 5 | 10 |
| 10 | 20 |
| 15 | 30 |
| 25 | 50 |

### Para Turnos de 1 Hora:

| Análises Esperadas | Meta/Hora |
|--------------------|-----------|
| 3 | 3 |
| 5 | 5 |
| 10 | 10 |
| 50 | 50 |
| 100 | 100 |

---

## 🎯 Interpretação do Performance

Com meta configurada, o Performance é calculado assim:

```
Performance = (Análises Reais / Horas Ativas) / Meta por Hora × 100
```

**Exemplo:**
- Meta: 15 análises/hora
- Realizadas: 10 análises em 0.5h (30 min)
- Taxa real: 10 / 0.5 = 20 análises/hora
- Performance: 20 / 15 × 100 = **133%** (limitado a 100%)

---

## ⚙️ Configuração Atual no Projeto

Seu projeto está configurado com:

```typescript
{
  metaAnalisePorHora: 50,      // ← Aceita decimais
  horasTurno: 0.33,            // 20 minutos
  turnoInicio: 9,              // 9h00
  turnoFim: 9.33,              // 9h20
  limiteGapParada: 10          // 10 minutos
}
```

---

## 💡 Dicas

1. **Para períodos curtos**, calcule sempre a meta por hora:
   ```
   meta = (análises_esperadas / minutos) × 60
   ```

2. **Para metas fracionadas**, use decimais:
   - 3.5 análises/hora = 1 análise a cada ~17 minutos

3. **Performance nunca ultrapassa 100%** no sistema (limitado)

4. **Use números realistas** baseados no seu processo real

---

## 🚀 Como Testar

1. Edite `src/types/i-oee.ts`
2. Altere `metaAnalisePorHora` para o valor desejado:
   ```typescript
   metaAnalisePorHora: 15.5,  // Exemplo com decimal
   ```
3. Recarregue a página OEE
4. O sistema calculará Performance baseado na nova meta

Pronto! Agora você pode usar metas precisas, incluindo valores decimais! 🎯
