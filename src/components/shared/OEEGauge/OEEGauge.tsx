import React from "react";
import "./styles.css";

interface OEEGaugeProps {
  valor: number;
  titulo: string;
  cor: string;
  tamanho?: number;
}

const OEEGauge: React.FC<OEEGaugeProps> = ({
  valor,
  titulo,
  cor,
  tamanho = 180
}) => {
  // Limita o valor entre 0 e 100
  const valorLimitado = Math.max(0, Math.min(100, valor));
  
  // Calcula o ângulo para o arco (180 graus = semicírculo)
  const angulo = (valorLimitado / 100) * 180;
  
  const raio = tamanho / 2 - 20;
  const centro = tamanho / 2;
  const circunferencia = Math.PI * raio;
  
  // Calcula o dasharray para criar o arco
  const dashArray = `${(angulo / 180) * circunferencia} ${circunferencia}`;

  return (
    <div className="oee-gauge-container">
      <svg width={tamanho} height={tamanho * 0.65} className="oee-gauge-svg">
        {/* Arco de fundo */}
        <path
          d={`M ${centro - raio} ${centro} A ${raio} ${raio} 0 0 1 ${centro + raio} ${centro}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Arco colorido */}
        <path
          d={`M ${centro - raio} ${centro} A ${raio} ${raio} 0 0 1 ${centro + raio} ${centro}`}
          fill="none"
          stroke={cor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          className="oee-gauge-progress"
        />
        
        {/* Texto central */}
        <text
          x={centro}
          y={centro - 10}
          textAnchor="middle"
          className="oee-gauge-value"
          fill={cor}
        >
          {valorLimitado.toFixed(1)}%
        </text>
        
        <text
          x={centro}
          y={centro + 15}
          textAnchor="middle"
          className="oee-gauge-title"
          fill="#6b7280"
        >
          {titulo}
        </text>
      </svg>
    </div>
  );
};

export default OEEGauge;
