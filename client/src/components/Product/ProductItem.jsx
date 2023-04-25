import {
  List,
  Collapse,
  Space,
  Avatar,
  Typography,
  Form,
  Input,
  Button,
} from "antd";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { update_singleProduct } from "../../features/productSlice";
import VariantItem from "./VariantItem";
import { socket } from "../..";

const { Panel } = Collapse;
const { Text } = Typography;

function ProductItem({ dispatch, product }) {
  /* For Edit */
  const [disabled, setDisabled] = useState(true);
  const updateProducts = (value) => {
    if (Number(value.timeGuarantee) !== Number(product.timeGuarantee)) {
      socket.emit("update-product", value);
      socket.on("done-update-product", (data) => {
        dispatch(update_singleProduct(data));
        socket.off("done-update-product");
      });
    }
    setDisabled(true);
  };
  /* End For Edit */

  return (
    <List.Item>
      <Collapse ghost size="small" collapsible="icon" expandIconPosition="end">
        <Panel
          header={
            <Space className="d-flex" align="start" size={15}>
              <Avatar size={55} src={product.productImage} />
              <Space direction="vertical">
                <Text strong>{product.productTitle}</Text>
                <Space size={30}>
                  <Text strong>Phân loại: {product.productType || ""}</Text>
                  <Text strong>Thương hiệu: {product.productVendor || ""}</Text>
                  <Text strong>Mã IMEI: {product.productID || ""}</Text>
                  <Space>
                    <Text strong>Bảo hành: </Text>
                    <Form
                      onFinish={updateProducts}
                      initialValues={{
                        id: product._id,
                        timeGuarantee:
                          product.timeGuarantee || "Chưa có dữ liệu",
                      }}
                    >
                      <Space>
                        <Form.Item name="id" hidden>
                          <Input
                            style={{ width: "50px" }}
                            disabled={disabled}
                          />
                        </Form.Item>
                        <Form.Item noStyle={true} name="timeGuarantee">
                          <Input
                            autoComplete="off"
                            style={{ width: "50px" }}
                            size="small"
                            disabled={disabled}
                          />
                        </Form.Item>
                        {disabled ? (
                          <Form.Item noStyle={true}>
                            <Button
                              size="small"
                              type="button"
                              htmlType="button"
                              onClick={(e) => setDisabled(false)}
                            >
                              <EditOutlined />
                              Chỉnh sửa
                            </Button>
                          </Form.Item>
                        ) : (
                          <Form.Item noStyle={true}>
                            <Button type="text" htmlType="submit" size="small">
                              <SaveOutlined />
                              Lưu
                            </Button>
                          </Form.Item>
                        )}
                      </Space>
                    </Form>
                  </Space>
                </Space>
              </Space>
            </Space>
          }
        >
          <List
            dataSource={product.productVariant}
            renderItem={(variant) => (
              <List.Item>
                <VariantItem product={product} variant={variant} />
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
    </List.Item>
  );
}

export default ProductItem;
