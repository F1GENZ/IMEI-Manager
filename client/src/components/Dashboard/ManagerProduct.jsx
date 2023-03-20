import { Link } from "react-router-dom";
import { Typography, Col, Row, Input, Empty, Space } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_allProducts } from "../../features/products/productSlice";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
const { Text } = Typography;

function Manager_Product() {
  const [dataSearch, setDataSearch] = useState("");
  const { products, isLoadingProduct, isErrorProduct, messageProduct } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isErrorProduct) toast.error(messageProduct);
    dispatch(get_allProducts(dataSearch));
  }, [dataSearch, dispatch, isErrorProduct, messageProduct]);

  const productItems =
    products && products.length > 0 ? (
      products.map((value, key) => (
        <Row className="product-item" key={key} gutter={30}>
          <Col span={12}>
            <Link to={value._id}>{value.productTitle || ""}</Link>
          </Col>
          <Col span={4}>{value.variantTitle || ""}</Col>
          <Col span={4}>{value.codeIMEI || "Chưa có dữ liệu"}</Col>
          <Col span={4}>{value.timeGuarantee || "Chưa có dữ liệu"}</Col>
        </Row>
      ))
    ) : (
      <Empty description="Chưa có thông tin dữ liệu" />
    );

  if (isLoadingProduct) {
    return <Spinner />;
  }

  return (
    <Space size={15} direction="vertical" className="dashboard-product d-flex">
      <Input.Search
        addonBefore="Danh sách sản phẩm: "
        placeholder="Nhập tên sản phẩm cần tìm"
        enterButton
        defaultValue={dataSearch}
        onSearch={(value) => setDataSearch(value)}
      />
      <Space
        direction="vertical"
        size={15}
        className="dashboard-product-data d-flex"
      >
        <Row className="product-item" gutter={30}>
          <Col span={12}>
            <Text strong>Tên sản phẩm</Text>
          </Col>
          <Col span={4}>
            <Text strong>Phân loại</Text>
          </Col>
          <Col span={4}>
            <Text strong>Mã IMEI</Text>
          </Col>
          <Col span={4}>
            <Text strong>Thời gian bảo hành</Text>
          </Col>
        </Row>
        {productItems}
      </Space>
    </Space>
  );
}

export default Manager_Product;
