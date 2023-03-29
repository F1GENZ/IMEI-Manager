import React, { useEffect, useState } from "react";
import {
  PrinterOutlined,
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Row, Col, Typography, Button, Space, Image, Input, Form } from "antd";
import ModalPrint from "../Print/ModalPrint";
import { useDispatch, useSelector } from "react-redux";
import {
  get_singleProduct,
  remove_singleUser,
  update_singleProduct,
} from "../../features/products/productSlice";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import moment from "moment";

const { Title, Text } = Typography;

function ManagerDetail() {
  const dispatch = useDispatch();
  const { products, isLoadingProduct, isErrorProduct, messageProduct } =
    useSelector((state) => state.product);

  const currentId = window.location.pathname.split("/").reverse()[0];
  useEffect(() => {
    if (isErrorProduct) toast.error(messageProduct);
    dispatch(get_singleProduct(currentId));
  }, [dispatch, isErrorProduct, messageProduct, currentId]);

  /* For Edit */
  const [disabled, setDisabled] = useState(true);
  /* End For Edit */

  /* For Print */
  const [isModalOpen, setIsModalOpen] = useState(false);
  /* End For Print */

  const deleteUser = (productID, clientID) => {
    dispatch(remove_singleUser({ productID, clientID }));
  };

  const updateProducts = (value) => {
    if (
      Number(value.timeGuarantee) !== Number(products.response.timeGuarantee)
    ) {
      dispatch(update_singleProduct(value));
    }
    setDisabled(true);
  };
  const dataProduct = products && products.response && (
    <Row className="imei-item-head" gutter={15}>
      <Col lg={2} md={24} sm={24} xs={24}>
        <Image
          src={products.response.productImage}
          alt={products.response.productTitle || ""}
        />
      </Col>
      <Col lg={22} md={24} sm={24} xs={24}>
        <Title level={4}>{products.response.productTitle || ""}</Title>
        <Row gutter={30} align="middle">
          <Col>
            <Text strong>Phân loại: </Text>
            {products.response.variantTitle || "Chưa có dữ liệu"}
          </Col>
          <Col>
            <Text strong>Thương hiệu: </Text>
            {products.response.productVendor || "Chưa có dữ liệu"}
          </Col>
          <Col>
            <Text strong>Mã IMEI: </Text>
            {products.response.codeIMEI || "Chưa có dữ liệu"}
          </Col>
          <Col>
            <Space>
              <Text strong>Bảo hành: </Text>
              <Form
                onFinish={updateProducts}
                initialValues={{
                  id: products.response._id,
                  timeGuarantee:
                    products.response.timeGuarantee || "Chưa có dữ liệu",
                }}
              >
                <Space>
                  <Form.Item name="id" hidden>
                    <Input style={{ width: "50px" }} disabled={disabled} />
                  </Form.Item>
                  <Form.Item noStyle={true} name="timeGuarantee">
                    <Input style={{ width: "50px" }} disabled={disabled} />
                  </Form.Item>
                  {disabled ? (
                    <Form.Item noStyle={true}>
                      <Button
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
                      <Button type="text" htmlType="submit">
                        <SaveOutlined />
                        Lưu
                      </Button>
                    </Form.Item>
                  )}
                </Space>
              </Form>
            </Space>
          </Col>
          <Space size={15}>
            {products.response.codeIMEI !== "" && (
              <>
                <Button type="text" onClick={(e) => setIsModalOpen(true)}>
                  <PrinterOutlined />
                  In
                </Button>
                <ModalPrint
                  value={products.response}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              </>
            )}
          </Space>
        </Row>
      </Col>
    </Row>
  );

  const dataGuarantee =
    products &&
    products.response &&
    products.response.clientGuarantee &&
    products.response.clientGuarantee.length > 0 &&
    products.response.clientGuarantee.map((value, key) => (
      <Row className="user-item" key={key}>
        <Col lg={6} md={24} sm={24} xs={24}>
          <Text strong className="visible-md">
            Họ và tên:
          </Text>
          {value.name}
        </Col>
        <Col lg={6} md={24} sm={24} xs={24}>
          <Text strong className="visible-md">
            Số điện thoại:
          </Text>
          {value.phone}
        </Col>
        <Col lg={5} md={24} sm={24} xs={24}>
          <Text strong className="visible-md">
            Ngày kích hoạt:
          </Text>
          {moment(value.timeStart).format("DD/MM/YYYY")}
        </Col>
        <Col lg={5} md={24} sm={24} xs={24}>
          <Text strong className="visible-md">
            Ngày kết thúc:
          </Text>
          {moment(value.timeEnd).format("DD/MM/YYYY")}
        </Col>
        <Col lg={2} md={24} sm={24} xs={24}>
          <Text strong className="visible-md">
            Thao tác:
          </Text>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={(e) => deleteUser(products.response._id, value._id)}
          >
            Hủy
          </Button>
        </Col>
      </Row>
    ));

  if (isLoadingProduct) {
    return <Spinner />;
  }

  return (
    <Space className="imei-item d-flex" size={15} direction="vertical">
      {dataProduct}
      <Row>
        <Col lg={6} md={0} sm={0} xs={0}>
          <Text strong underline>
            Họ và tên
          </Text>
        </Col>
        <Col lg={6} md={0} sm={0} xs={0}>
          <Text strong underline>
            Số điện thoại
          </Text>
        </Col>
        <Col lg={5} md={0} sm={0} xs={0}>
          <Text strong underline>
            Thời gian kích hoạt bảo hành
          </Text>
        </Col>
        <Col lg={5} md={0} sm={0} xs={0}>
          <Text strong underline>
            Thời gian hết hạn bảo hành
          </Text>
        </Col>
        <Col lg={2} md={0} sm={0} xs={0}>
          <Text strong underline>
            Thao tác
          </Text>
        </Col>
      </Row>
      {dataGuarantee}
    </Space>
  );
}

export default ManagerDetail;
