# 🕐 Como Usar Horários Quebrados no OEE

## ✅ Implementado

Agora você pode usar horários com minutos (horários "quebrados") no formato **decimal**.

---

## 📝 Formato Decimal

### Como Funciona:
```
Hora Decimal = Hora + (Minutos / 60)
```

### Exemplos:

| Horário | Formato Decimal | Cálculo |
|---------|----------------|---------|
| 9h00 | `9.0` ou `9` | 9 + (0/60) = 9.0 |
| 9h30 | `9.5` | 9 + (30/60) = 9.5 |
| 9h15 | `9.25` | 9 + (15/60) = 9.25 |
| 9h45 | `9.75` | 9 + (45/60) = 9.75 |
| 14h20 | `14.333` | 14 + (20/60) ≈ 14.33 |
| 17h45 | `17.75` | 17 + (45/60) = 17.75 |

---

## 🔧 Como Configurar

### Exemplo 1: Turno de 9h até 9h30
```typescript
export const DEFAULT_OEE_CONFIG: OEEConfig = {
  metaAnalisePorHora: 50,
  horasTurno: 0.5,        // 30 minutos = 0.5 horas
  turnoInicio: 9,         // 9h00
  turnoFim: 9.5,          // 9h30
  limiteGapParada: 20
};
```

### Exemplo 2: Turno de 8h15 até 16h45
```typescript
export const DEFAULT_OEE_CONFIG: OEEConfig = {
  metaAnalisePorHora: 50,
  horasTurno: 8.5,        // 8h30min
  turnoInicio: 8.25,      // 8h15
  turnoFim: 16.75,        // 16h45
  limiteGapParada: 20
};
```

### Exemplo 3: Turno noturno (23h30 até 7h15)
```typescript
export const DEFAULT_OEE_CONFIG: OEEConfig = {
  metaAnalisePorHora: 50,
  horasTurno: 7.75,       // 7h45min
  turnoInicio: 23.5,      // 23h30
  turnoFim: 7.25,         // 7h15 (dia seguinte)
  limiteGapParada: 20
};
```

---

## 🧮 Funções Auxiliares

### Converter Decimal → Hora:Minuto
```typescript
import { decimalParaHoraMinuto } from "../types/i-oee";

const resultado = decimalParaHoraMinuto(9.5);
// resultado = { hora: 9, minuto: 30 }

console.log(`${resultado.hora}h${resultado.minuto}`); // "9h30"
```

### Converter Hora:Minuto → Decimal
```typescript
import { horaMinutoParaDecimal } from "../types/i-oee";

const decimal = horaMinutoParaDecimal(9, 30);
// decimal = 9.5

const decimal2 = horaMinutoParaDecimal(14, 20);
// decimal2 = 14.333...
```

---

## 📊 Cálculo de horasTurno

Para calcular quantas horas tem o turno:

```typescript
// Exemplo: Turno de 9h30 até 17h45
const inicio = 9.5;   // 9h30
const fim = 17.75;    // 17h45

const horasTurno = fim - inicio;  // 17.75 - 9.5 = 8.25 horas (8h15min)
```

---

## 🎯 Exemplos Práticos

### Turno de Almoço (11h45 até 13h15)
```typescript
{
  turnoInicio: 11.75,     // 11h45
  turnoFim: 13.25,        // 13h15
  horasTurno: 1.5         // 1h30min
}
```

### Turno Vespertino (13h20 até 22h10)
```typescript
{
  turnoInicio: 13.333,    // 13h20 (13 + 20/60)
  turnoFim: 22.167,       // 22h10 (22 + 10/60)
  horasTurno: 8.833       // ~8h50min
}
```

---

## 🔍 Visualização na Interface

O sistema automaticamente formata os horários para exibição:

- `9.0` → exibe como **"9h"**
- `9.5` → exibe como **"9h30"**
- `14.25` → exibe como **"14h15"**
- `17.75` → exibe como **"17h45"**

---

## ⚠️ Importante

1. **Use sempre formato decimal** nos arquivos de configuração
2. Os minutos são convertidos automaticamente para exibição
3. A filtragem de produtos agora considera minutos corretamente
4. O cálculo de disponibilidade permanece o mesmo

---

## 🚀 Testando

1. Edite o arquivo: `src/types/i-oee.ts`
2. Modifique `DEFAULT_OEE_CONFIG`:
   ```typescript
   turnoInicio: 9.5,   // 9h30
   turnoFim: 10,       // 10h00
   horasTurno: 0.5     // 30 minutos
   ```
3. Recarregue a página OEE
4. O sistema mostrará: **"Turno: 9h30 - 10h"**

Pronto! Agora você pode usar qualquer horário quebrado! ⏰
