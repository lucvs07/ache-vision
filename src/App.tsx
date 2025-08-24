import "./App.css";
import Card from "./components/shared/Card/Card";
import Sidebar from "./components/shared/Sidebar/Sidebar";
import { mockProducts } from "./types/mockProducts";

function App() {
  return (
    <>
      <Sidebar />
    <div className="flex justify-center items-center min-h-screen gap-4">
      {mockProducts.map((product) => (
        <Card key={product.id} {...product} />
      ))}
    </div>
    </>
  );
}

export default App;
