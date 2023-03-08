import ManagerImei from "./ManagerImei";
import ManagerProduct from "./ManagerProduct";
import Notify from "./Notify";
import Setting from "./Setting";
import Support from "./Support";
import { Routes, Route, Navigate } from "react-router-dom";
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
      <Route path="/admin/manager/imei" element={<ManagerImei />} />
      <Route path="/admin/notify" element={<Notify />} />
      <Route path="/admin/setting" element={<Setting />} />
      <Route path="/admin/support" element={<Support />} />
    </Routes>
  );
}

export default Dashboard;
