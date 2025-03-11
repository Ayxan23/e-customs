import "./assets/styles/reset.css";
import "./assets/styles/global.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages/main/Main";
import CustomPayments from "./pages/customs-payments/CustomPayments";
import Gooen from "./pages/gooen/Gooen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/customs-payments" element={<CustomPayments />} />
        <Route path="/gooen" element={<Gooen />} />
      </Routes>
    </Router>
  );
}

export default App;
