import { HomeTwoTone } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function HomeBreadCrumb(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const { products } = useSelector((state) => state.product);

  const breadcrumbNameMap = {
    products: "Quản lý sản phẩm",
    users: "Quản lý người dùng",
    setting: "Cài đặt",
  };

  const extraBreadcrumbItems = pathSnippets.map((value, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    let breadcrumbData;
    if (breadcrumbNameMap[value]) {
      breadcrumbData = (
        <Breadcrumb.Item key={url} href="#" onClick={(e) => navigate(url)}>
          {breadcrumbNameMap[value]}
        </Breadcrumb.Item>
      );
    } else {
      if (products && products.response) {
        if (products.response._id === value) {
          breadcrumbData = (
            <Breadcrumb.Item key={url}>{products.response.productTitle}</Breadcrumb.Item>
          );
        }
      }
    }
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
