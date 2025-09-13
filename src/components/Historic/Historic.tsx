import React, { useState } from "react";
import { useEffect } from "react";
import "./styles.css";
import Modal from "../shared/Modal/Modal";
import Card from "../shared/Card/Card";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";
import type { Product } from "../../types/i-product";
import { ApiService } from "../../services/api.service";
import { ErrorBoundary } from "react-error-boundary";

const Historic: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Product | null>(null);
  const [productsList, setProducts] = useState<Product[]>();

  useEffect(() => {
    ApiService.getProducts()
      .then((products: Product[]) => {
        console.log("Produtos retornados da API:", products);
        setProducts(products);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
      });
  }, []);

  const handleCardClick = (cardData: Product) => {
    setSelectedCard(cardData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  return (
    <section className="section-historic">
      <div className="section-header">
        <h2 className="font-krona text-2xl">Histórico</h2>
        <ArrowCircleRightIcon
          size={48}
          weight="fill"
          className="text-orange-700 cursor-pointer"
        />
      </div>
      <div className="cards-container">
        {(productsList ?? []).map((product) => (
          <Card
            key={product.id}
            {...product}
            onClick={() => handleCardClick(product)}
          />
        ))}
      </div>
      {isModalOpen && selectedCard && (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Modal
            onClose={handleCloseModal}
            open={isModalOpen}
            id={selectedCard.id}
            data={selectedCard.data}
            tipo={selectedCard.tipo}
            aprovado={selectedCard.aprovado}
            status={selectedCard.status}
            veracidade={selectedCard.veracidade}
            imgLabel={selectedCard.imgLabel}
            imgNormal={selectedCard.imgNormal}
          >
          </Modal>
        </ErrorBoundary>
      )}
    </section>
  );
};

export default Historic;
