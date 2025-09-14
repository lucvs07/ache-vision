import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Historic from "./components/Historic/Historic";
import HistoricTable from "./pages/HistoricTable";
import Sidebar from "./components/shared/Sidebar/Sidebar";
import Hero from "./components/Hero/Hero";

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Historic />
            </>
          }
        />
        <Route path="/historico" element={<HistoricTable />} />
      </Routes>
    </Router>
  );
}

export default App;
