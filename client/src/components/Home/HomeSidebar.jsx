import {
  SettingOutlined,
  PieChartOutlined,
  NotificationOutlined,
  CustomerServiceOutlined,
  InboxOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
const Sider = Layout.Sider;

function HomeSidebar(props) {
  const navigate = useNavigate();
  function getItem(label, key, icon, children) {
    return {
      label,
      key,
      icon,
      children,
    };
  }
  const items = [
    getItem("Trình quản lý", "admin/manager", <PieChartOutlined />, [
      getItem("Dựa trên Product", "product", <InboxOutlined />),
      getItem("Dựa trên IMEI", "imei", <BarcodeOutlined />),
    ]),
    getItem("Thông báo", "admin/notify", <NotificationOutlined />),
    getItem("Cài đặt", "admin/setting", <SettingOutlined />),
    getItem("Hỗ trợ", "admin/support", <CustomerServiceOutlined />),
  ];
  return (
    <Sider
      trigger={null}
      className={props.className}
      breakpoint="lg"
      collapsedWidth="50"
    >
      <h1 className="home-sidebar-logo">
        <img width="32" height="32" src="/logo.png" alt="IMEI Manager" />
        <span>IMEI Manager</span>
      </h1>
      <Menu
        onClick={({ keyPath }) => navigate(`/${keyPath.reverse().join("/")}`)}
        inlineIndent="10"
        theme="dark"
        mode="inline"
        items={items}
        defaultOpenKeys={["manager"]}
        defaultSelectedKeys={["product"]}
      ></Menu>
    </Sider>
  );
}

export default HomeSidebar;
