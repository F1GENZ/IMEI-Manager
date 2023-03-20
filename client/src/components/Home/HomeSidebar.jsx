import { SettingOutlined, PieChartOutlined } from "@ant-design/icons";
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
    getItem("Trình quản lý", "/admin/manager", <PieChartOutlined />),
    getItem("Cài đặt", "/admin/setting", <SettingOutlined />),
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
        defaultSelectedKeys={[location.pathname]}
      ></Menu>
    </Sider>
  );
}

export default HomeSidebar;
