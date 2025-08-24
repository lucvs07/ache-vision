import React from "react";
import "./styles.css";
import { mockProducts } from "../../types/mockProducts";
import Card from "../shared/Card/Card";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";

// Historic component
const Historic: React.FC = () => {
  return (
    <section className="section-historic">
      <div className="section-header">
        <h2 className="font-krona text-2xl">Histórico</h2>
        <ArrowCircleRightIcon size={48} weight="fill" className="text-orange-700"/>
      </div>
      <div className="cards-container">
        {mockProducts.map((product) => (
          <Card key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default Historic;
