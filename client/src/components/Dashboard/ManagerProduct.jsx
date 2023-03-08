import { Link } from "react-router-dom";
import { Typography, Col, Row, Input, Button } from "antd";
import { ImportOutlined } from "@ant-design/icons";
const { Text } = Typography;
function Manager_Product(props) {
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
        defaultValue={props.dataSearch}
        onChange={(e) => props.setDataSearch(e.target.value)}
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
        {props.products &&
          props.products.map((value, _) => (
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
