import "./App.css";

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HistoricTable from "./pages/HistoricTable";
import Sidebar from "./components/shared/Sidebar/Sidebar";
import Consulta from "./pages/Consulta";
import OEE from "./pages/OEE";

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/historico" element={<HistoricTable />} />
        <Route path="/consulta" element={<Consulta />} />
        <Route path="/oee" element={<OEE />} />
      </Routes>
    </Router>
  );
}

export default App;
