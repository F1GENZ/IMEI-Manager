import { Routes, Route, Navigate } from "react-router-dom";

import ManagerProduct from "./ManagerProduct";
import Setting from "./Setting";
import ManagerDetail from "./ManagerDetail";
import ManagerUser from "./ManagerUser";
import Authentication from "./Authentication";

function Dashboard() {
  return (
    <Routes>
      <Route
        path="*"
        element={<Navigate to="/admin/products" replace={true} />}
      />
      <Route path="authentication" element={<Authentication />} />
      <Route path="admin/products" element={<ManagerProduct />} />
      <Route path="admin/products/:id" element={<ManagerDetail />} />
      <Route path="admin/users" element={<ManagerUser />} />
      {/* <Route path="admin/setting" element={<Setting />} /> */}
    </Routes>
  );
}

export default Dashboard;
