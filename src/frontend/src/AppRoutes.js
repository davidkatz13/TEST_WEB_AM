import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AssetOverview from "./components/AssetOverview";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/asset_overview" element={<AssetOverview />}></Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
