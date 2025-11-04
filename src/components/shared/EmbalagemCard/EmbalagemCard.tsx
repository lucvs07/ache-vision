import React, { useState, useEffect } from "react";
import "./styles.css";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

type ProductTypeStats = {
  name: string;
  icon: React.ElementType;
  aprovados: number;
  comAvaria: number;
  total: number;
};

type EmbalagemCardProps = {
  stats: ProductTypeStats[];
  className?: string;
};

const EmbalagemCard: React.FC<EmbalagemCardProps> = ({
  stats,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const currentStat = stats[currentIndex];
  const porcentagemAprovadas = currentStat.total > 0 
    ? Math.round((currentStat.aprovados / currentStat.total) * 100) 
    : 0;

  // Define a cor da barra baseada na porcentagem
  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return 'from-success-500 to-success-600';
    if (percentage >= 60) return 'from-warning-500 to-warning-600';
    return 'from-danger-500 to-danger-600';
  };

  const barColorClass = getBarColor(porcentagemAprovadas);

  const handleNext = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + stats.length) % stats.length);
      setIsAnimating(false);
    }, 300);
  };

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const IconComponent = currentStat.icon;

  return (
    <div className={`embalagem-card ${className}`}>
      <div className="embalagem-header">
        <div className={`flex items-center gap-2 carousel-header ${isAnimating ? `slide-${direction}` : ''}`}>
          <IconComponent size={32} weight="fill" />
          <span className="font-krona text-xl">{currentStat.name}</span>
        </div>
        <div className="carousel-controls">
          <button 
            onClick={handlePrev} 
            className="carousel-btn"
            aria-label="Anterior"
            disabled={isAnimating}
          >
            <CaretLeftIcon size={20} weight="bold" />
          </button>
          <span className="carousel-indicator">
            {currentIndex + 1}/{stats.length}
          </span>
          <button 
            onClick={handleNext} 
            className="carousel-btn"
            aria-label="Próximo"
            disabled={isAnimating}
          >
            <CaretRightIcon size={20} weight="bold" />
          </button>
        </div>
      </div>
      <div className={`embalagem-content ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        <div className="embalagem-stat">
          <span className="stat-label">Bons</span>
          <span className="stat-value text-success-700">{currentStat.aprovados}</span>
        </div>
        <div className="embalagem-stat">
          <span className="stat-label">Com Avaria</span>
          <span className="stat-value text-danger-700">{currentStat.comAvaria}</span>
        </div>
        <div className="embalagem-percentage">
          <div className="percentage-bar-container">
            <div 
              className={`percentage-bar-fill bg-gradient-to-r ${barColorClass}`}
              style={{ width: `${porcentagemAprovadas}%` }}
            />
          </div>
          <span className="percentage-text">{porcentagemAprovadas}% Aprovados</span>
        </div>
        <div className="carousel-dots">
          {stats.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (isAnimating) return;
                setDirection(index > currentIndex ? 'right' : 'left');
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsAnimating(false);
                }, 300);
              }}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              aria-label={`Ir para ${stats[index].name}`}
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmbalagemCard;