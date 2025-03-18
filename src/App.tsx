import "./assets/styles/reset.css";
import "./assets/styles/global.css";
import "./assets/styles/variable.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Main from "./pages/main/Main";
import CustomPayments from "./pages/customs-payments/CustomPayments";
import Gooen from "./pages/gooen/Gooen";
import Queue from "./pages/queue/Queue";
import Restrictions from "./pages/border-restrictions/Restrictions";

import NomenLayout from "./pages/goods-nomenclature/NomenLayout";
import Nomenc from "./pages/goods-nomenclature/nomenc/Nomenc";
import DefiningCode from "./pages/goods-nomenclature/defining-code/DefiningCode";
import MandatoryDecision from "./pages/goods-nomenclature/mandatory-decision/MandatoryDecision";
import ValueClass from "./pages/goods-nomenclature/value-classification/ValueClass";
import CheckImei from "./pages/check-imei/CheckImei";

import CalculatorLayout from "./pages/calculator/CalculatorLayout";
import Auto from "./pages/calculator/auto/Auto";
import Goods from "./pages/calculator/goods/Goods";

import PassengerLayout from "./pages/passenger-declaration/PassengerLayout";
import Chekc from "./pages/passenger-declaration/check/Check";
import Add from "./pages/passenger-declaration/add/Add";
import LiveQueue from "./pages/live-queue/LiveQueue";
import Detail from "./pages/live-queue/detail/Detail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/customs-payments" element={<CustomPayments />} />
        <Route path="/gooen" element={<Gooen />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/border-restrictions" element={<Restrictions />} />
        <Route path="/check-imei" element={<CheckImei />} />
        <Route path="/live-queue" element={<LiveQueue />} />
        <Route path="/live-queue/detail/:id/:page" element={<Detail />} />

        <Route path="/goods-nomenclature" element={<NomenLayout />}>
          <Route index element={<Navigate to="nomenc" replace />} />
          <Route path="nomenc" element={<Nomenc />} />
          <Route path="defining-code" element={<DefiningCode />} />
          <Route path="mandatory-decision" element={<MandatoryDecision />} />
          <Route path="value-classification" element={<ValueClass />} />
        </Route>

        <Route path="/calculator" element={<CalculatorLayout />}>
          <Route index element={<Navigate to="auto" replace />} />
          <Route path="auto" element={<Auto />} />
          <Route path="goods" element={<Goods />} />
        </Route>

        <Route path="/passenger-declaration" element={<PassengerLayout />}>
          <Route index element={<Navigate to="chekc" replace />} />
          <Route path="chekc" element={<Chekc />} />
          <Route path="add" element={<Add />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
