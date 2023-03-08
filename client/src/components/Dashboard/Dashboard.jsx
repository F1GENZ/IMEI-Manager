import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { get_allProducts } from "../../features/products/productSlice";
import { toast } from "react-toastify";

import ManagerImei from "./ManagerImei";
import ManagerProduct from "./ManagerProduct";
import Notify from "./Notify";
import Setting from "./Setting";
import Support from "./Support";
import ManagerDetail from "./ManagerDetail";

function Dashboard() {
  const [dataSearch, setDataSearch] = useState("");
  const { products, isError, message } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  useEffect(() => {
    const getData = setTimeout(() => {
      if (isError) toast.error(message);
      dispatch(get_allProducts(dataSearch));
    }, 750);
    return () => clearTimeout(getData);
  }, [dataSearch, dispatch, isError, message]);

  return (
    <Routes>
      <Route
        path="*"
        element={<Navigate to="/admin/manager" replace={true} />}
      />
      <Route
        path="/admin/manager"
        element={
          <ManagerProduct
            products={products}
            dataSearch={dataSearch}
            setDataSearch={setDataSearch}
          />
        }
      />
      <Route
        path="/admin/manager/:id"
        element={<ManagerDetail products={products} />}
      />
      <Route path="/admin/manager/imei" element={<ManagerImei />} />
      <Route path="/admin/notify" element={<Notify />} />
      <Route path="/admin/setting" element={<Setting />} />
      <Route path="/admin/support" element={<Support />} />
    </Routes>
  );
}

export default Dashboard;
