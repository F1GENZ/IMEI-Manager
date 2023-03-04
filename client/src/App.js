/* eslint-disable react/jsx-pascal-case */
import { Layout } from "antd";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomeBreadCrumb from "./components/Home/HomeBreadCrumb";
import HomeSidebar from "./components/Home/HomeSidebar";
import Manager_Imei from "./components/Manager_Imei";
import Manager_Product from "./components/Manager_Product";
import Notify from "./components/Notify";
import Setting from "./components/Setting";
import Support from "./components/Support";

const { Content, Footer } = Layout;

const App = () => {
  return (
    <Router>
      <Layout className="home">
        <HomeSidebar className="home-sidebar" />
        <Layout className="site-layout home-layout">
          <HomeBreadCrumb className="home-layout-breadcrumb" />
          <Content className="home-layout-content">
            <Routes>
              <Route
                path="*"
                element={<Navigate to="/admin/manager/product" replace={true} />}
              />
              <Route path="/admin/manager/product" element={<Manager_Product />} />
              <Route path="/admin/manager/imei" element={<Manager_Imei />} />
              <Route path="/admin/notify" element={<Notify />} />
              <Route path="/admin/setting" element={<Setting />} />
              <Route path="/admin/support" element={<Support />} />
            </Routes>
          </Content>
          <Footer className="home-layout-footer">
            IMEI Manager ©2023 Created by F1GENZ TECHNOLOGY
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
};
export default App;
