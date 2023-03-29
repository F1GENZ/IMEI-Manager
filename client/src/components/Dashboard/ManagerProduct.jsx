import { Link } from "react-router-dom";
import { Typography, Col, Row, Input, Empty, Space, Pagination } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_allProducts } from "../../features/products/productSlice";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
const { Text } = Typography;

function Manager_Product() {
  const [dataSearch, setDataSearch] = useState("");
  const limit = 7;
  const [paginate, setPaginate] = useState(1);
  const { products, isLoadingProduct, isErrorProduct, messageProduct } =
    useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isErrorProduct) toast.error(messageProduct);
    dispatch(
      get_allProducts({
        filter: dataSearch,
        limit,
        paginate,
      })
    );
  }, [dataSearch, dispatch, isErrorProduct, messageProduct, limit, paginate]);

  const productItems =
    products && products.response.length > 0 ? (
      products.response.map((value, key) => (
        <Row className="product-item" key={key} gutter={30}>
          <Col lg={12} md={24} sm={24} xs={24}>
            <Link to={value._id}>{value.productTitle || ""}</Link>
          </Col>
          <Col lg={3} md={24} sm={24} xs={24}>
            <Text strong className="visible-md">
              Phân loại:
            </Text>
            {value.variantTitle || ""}
          </Col>
          <Col lg={3} md={24} sm={24} xs={24}>
            <Text strong className="visible-md">
              Thương hiệu:
            </Text>
            {value.productVendor || ""}
          </Col>
          <Col lg={3} md={24} sm={24} xs={24}>
            <Text strong className="visible-md">
              Mã IMEI:
            </Text>
            {value.codeIMEI || "Chưa có dữ liệu"}
          </Col>
          <Col lg={3} md={24} sm={24} xs={24}>
            <Text strong className="visible-md">
              Thời gian bảo hành:
            </Text>
            {value.timeGuarantee || "Chưa có dữ liệu"}
          </Col>
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
        addonBefore="Sản phẩm: "
        placeholder="Nhập tên sản phẩm cần tìm..."
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
          <Col lg={12} sm={0} md={0} xs={0}>
            <Text strong>Tên sản phẩm</Text>
          </Col>
          <Col lg={3} sm={0} md={0} xs={0}>
            <Text strong>Phân loại</Text>
          </Col>
          <Col lg={3} sm={0} md={0} xs={0}>
            <Text strong>Thương hiệu</Text>
          </Col>
          <Col lg={3} sm={0} md={0} xs={0}>
            <Text strong>Mã IMEI</Text>
          </Col>
          <Col lg={3} sm={0} md={0} xs={0}>
            <Text strong>Thời gian bảo hành</Text>
          </Col>
        </Row>
        {productItems}
        {products && products.totalPages > limit && products.totalPages && (
          <Pagination
            defaultPageSize={limit}
            defaultCurrent={paginate}
            total={products.totalPages}
            onChange={(page, pageSize) => {
              setPaginate(page);
            }}
          />
        )}
      </Space>
    </Space>
  );
}

export default Manager_Product;
