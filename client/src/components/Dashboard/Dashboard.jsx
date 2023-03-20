import { Routes, Route, Navigate } from "react-router-dom";

import ManagerProduct from "./ManagerProduct";
import Setting from "./Setting";
import ManagerDetail from "./ManagerDetail";

function Dashboard() {
  return (
    <Routes>
      <Route
        path="*"
        element={<Navigate to="/admin/manager" replace={true} />}
      />
      <Route path="/admin/manager" element={<ManagerProduct />} />
      <Route path="/admin/manager/:id" element={<ManagerDetail />} />
      <Route path="/admin/setting" element={<Setting />} />
    </Routes>
  );
}

export default Dashboard;
