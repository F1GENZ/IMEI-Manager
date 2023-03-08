import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Col, Row, Input, Button } from "antd";
import { ImportOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  get_allProducts,
  get_searchProduct,
  reset,
} from "../../features/products/productSlice";
import { toast } from "react-toastify";
const { Text } = Typography;
function Manager_Product() {
  const { products, isError, isLoading, message } = useSelector(
    (state) => state.product
  );
  const [dataSearch, setDataSearch] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const getData = setTimeout(() => {
      if (isError) toast.error(message);
      dispatch(get_allProducts(dataSearch));
    }, 750);
    return () => clearTimeout(getData);
  }, [dataSearch, dispatch, isError, message]);

  return (
    <div className="dashboard-product">
      <div className="dashboard-product-head">
        <h2>Danh sách sản phẩm</h2>
        <Button type="link">
          <ImportOutlined /> Nhập dữ liệu
        </Button>
      </div>
      <Input.Search
        placeholder="Nhập tên sản phẩm cần tìm"
        enterButton
        onChange={(e) => setDataSearch(e.target.value)}
      />
      <div className="dashboard-product-data">
        <Row className="product-item" key="" gutter={30}>
          <Col span={12}>
            <Text strong underline>
              Tên sản phẩm
            </Text>
          </Col>
          <Col span={6}>
            <Text strong underline>
              Phân loại
            </Text>
          </Col>
          <Col span={6}>
            <Text strong underline>
              Mã IMEI
            </Text>
          </Col>
        </Row>
        {products &&
          products.map((value, _) => (
            <Row
              className="product-item"
              key={value._id}
              gutter={30}
              data-varid={value.variantId && value.variantId}
            >
              <Col span={12}>
                <Link to={`${value._id}`}>{value.title}</Link>
              </Col>
              <Col span={6}>{value.variantTitle && value.variantTitle}</Col>
              <Col span={6}>{value.imei ? value.imei : "Chưa có dữ liệu"}</Col>
            </Row>
          ))}
      </div>
    </div>
  );
}

export default Manager_Product;
