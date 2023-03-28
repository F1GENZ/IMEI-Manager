import { PieChartOutlined, InboxOutlined } from "@ant-design/icons";
import { Layout, Menu, Image, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Text } = Typography;
const Sider = Layout.Sider;

function HomeSidebar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  function getItem(label, key, icon, children) {
    return {
      label,
      key,
      icon,
      children,
    };
  }
  const items = [
    getItem("Quản lý sản phẩm", "/admin/products", <InboxOutlined />),
    getItem("Quản lý người dùng", "/admin/users", <PieChartOutlined />),
    // getItem("Cài đặt", "/admin/setting", <SettingOutlined />),
  ];
  return (
    <Sider
      trigger={null}
      className={props.className}
      breakpoint="lg"
      collapsedWidth="50"
    >
      <Text className="home-sidebar-logo">
        <Image
          preview={false}
          width="32"
          height="32"
          src="/logo.png"
          alt="IMEI Manager"
        />
        <Text strong>IMEI Manager</Text>
      </Text>
      <Menu
        onClick={({ keyPath }) => navigate(`${keyPath.reverse().join("/")}`)}
        inlineIndent="10"
        theme="dark"
        mode="inline"
        items={items}
        defaultOpenKeys={["/admin/products"]}
        defaultSelectedKeys={[location.pathname]}
      ></Menu>
    </Sider>
  );
}

export default HomeSidebar;
