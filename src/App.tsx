import "./App.css";

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HistoricTable from "./pages/HistoricTable";
import Sidebar from "./components/shared/Sidebar/Sidebar";

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/historico" element={<HistoricTable />} />
      </Routes>
    </Router>
  );
}

export default App;
