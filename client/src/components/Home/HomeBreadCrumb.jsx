import { HomeTwoTone } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

function HomeBreadCrumb(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbNameMap = {
    products: "Quản lý sản phẩm",
    users: "Quản lý người dùng",
    agency: "Quản lý đại lý",
    notify: "Quản lý thông báo",
    setting: "Cài đặt",
  };

  const extraBreadcrumbItems = pathSnippets.map((value, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    let breadcrumbData;
    breadcrumbData = (
      <Breadcrumb.Item key={url} href="#" onClick={(e) => navigate(url)}>
        {breadcrumbNameMap[value]}
      </Breadcrumb.Item>
    );
    return breadcrumbData;
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <HomeTwoTone />
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return <Breadcrumb className={props.className}>{breadcrumbItems}</Breadcrumb>;
}

export default HomeBreadCrumb;
