/* eslint-disable react/jsx-pascal-case */
import { HomeTwoTone } from "@ant-design/icons";
import { Breadcrumb, Layout } from "antd";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
        <HomeSidebar />
        <Layout className="site-layout home-layout">
          <Content className="home-layout-content">
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              <Breadcrumb.Item>
                <HomeTwoTone />
              </Breadcrumb.Item>
              <Breadcrumb.Item>Trình quản lý</Breadcrumb.Item>
              <Breadcrumb.Item>Dựa trên Product</Breadcrumb.Item>
            </Breadcrumb>
            <div className="home-layout-content-wrapper">
              <Routes>
                <Route exac path="/manager/imei" element={<Manager_Imei />} />
                <Route
                  exac
                  path="/manager/product"
                  element={<Manager_Product />}
                />
                <Route exac path="/manager/setting" element={<Setting />} />
                <Route exac path="/manager/support" element={<Support />} />
                <Route exac path="/manager/notify" element={<Notify />} />
              </Routes>
            </div>
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
