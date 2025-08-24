import "./App.css";
import Historic from "./components/Historic/Historic";
import Sidebar from "./components/shared/Sidebar/Sidebar";
import Hero from "./components/Hero/Hero";

function App() {
  return (
    <>
      <Sidebar />
      <Hero />
      <Historic />
    </>
  );
}

export default App;
