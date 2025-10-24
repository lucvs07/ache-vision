import React from "react";
import "./styles.css";

interface OEECardProps {
  titulo: string;
  valor: number;
  meta?: number;
  unidade?: string;
  cor: string;
  descricao?: string;
}

const OEECard: React.FC<OEECardProps> = ({
  titulo,
  valor,
  meta,
  unidade = "%",
  cor,
  descricao
}) => {
  return (
    <div className="oee-card">
      <div className="oee-card-header">
        <h3 className="oee-card-title">{titulo}</h3>
        {descricao && <p className="oee-card-description">{descricao}</p>}
      </div>
      
      <div className="oee-card-body">
        <div className="oee-card-value" style={{ color: cor }}>
          {valor.toFixed(1)}
          <span className="oee-card-unit">{unidade}</span>
        </div>
        
        {meta !== undefined && (
          <div className="oee-card-meta">
            Meta: {meta}{unidade}
          </div>
        )}
      </div>
      
      {/* Barra de progresso */}
      <div className="oee-card-progress-container">
        <div 
          className="oee-card-progress-bar" 
          style={{ 
            width: `${Math.min(valor, 100)}%`,
            backgroundColor: cor 
          }}
        />
      </div>
    </div>
  );
};

export default OEECard;
