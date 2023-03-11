import { Layout } from "antd";

import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import HomeBreadCrumb from "./components/Home/HomeBreadCrumb";
import HomeSidebar from "./components/Home/HomeSidebar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Content, Footer } = Layout;

const App = () => {
  return (
    <Router>
      <Layout className="home">
        <HomeSidebar className="home-sidebar" />
        <Layout className="site-layout home-layout">
          <HomeBreadCrumb className="home-layout-breadcrumb" />
          <Content className="home-layout-content">
            <Dashboard />
          </Content>
          <Footer className="home-layout-footer">
            IMEI Manager ©2023 Created by F1GENZ TECHNOLOGY
          </Footer>
        </Layout>
      </Layout>
      <ToastContainer />
    </Router>
  );
};
export default App;
