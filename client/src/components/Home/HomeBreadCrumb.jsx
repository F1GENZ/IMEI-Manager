import { HomeTwoTone } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";

function HomeBreadCrumb(props) {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbNameMap = {
    "/admin/manager": "Trình quản lý",
    "/admin/manager/product": "Dựa trên Product",
    "/admin/manager/imei": "Dựa trên Imei",
    "/admin/notify": "Thông báo",
    "/admin/setting": "Cài đặt",
    "/admin/support": "Hỗ trợ",
  };

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return (
      <Breadcrumb.Item key={url}>{breadcrumbNameMap[url]}</Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <HomeTwoTone />
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return <Breadcrumb className={props.className}>{breadcrumbItems}</Breadcrumb>;
}

export default HomeBreadCrumb;
