import React, { useState } from "react";
import "./styles.css";
import { mockProducts } from "../../types/mockProducts";
import Modal from "../shared/Modal/Modal";
import Card from "../shared/Card/Card";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";
import type { Product } from "../../types/i-product";

const Historic: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Product | null>(null);

  const handleCardClick = (cardData : Product) => {
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
        {mockProducts.map((product) => (
          <Card
            key={product.id}
            {...product}
            onClick={() => handleCardClick(product)}
          />
        ))}
      </div>
      {isModalOpen && selectedCard && (
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
          {/* Renderize aqui o conteúdo do modal, usando selectedCard se necessário */}
          <div>Detalhes do Card</div>
          <pre>{JSON.stringify(selectedCard, null, 2)}</pre>
        </Modal>
      )}
    </section>
  );
};

export default Historic;
