import { Routes, Route, Navigate } from "react-router-dom";

import ManagerProduct from "./ManagerProduct";
import Setting from "./Setting";
import ManagerClient from "./ManagerClient";
import Authentication from "./Authentication";
import ManagerAgency from "./ManagerAgency";
import ManagerNotify from "./ManagerNotify";

function Dashboard() {
  return (
    <Routes>
      <Route
        path="*"
        element={<Navigate to="/admin/products" replace={true} />}
      />
      <Route path="authentication" element={<Authentication />} />
      <Route path="admin/products" element={<ManagerProduct />} />
      <Route path="admin/users" element={<ManagerClient />} />
      <Route path="admin/agency" element={<ManagerAgency />} />
      <Route path="admin/notify" element={<ManagerNotify />} />
      <Route path="admin/setting" element={<Setting />} />
    </Routes>
  );
}

export default Dashboard;
