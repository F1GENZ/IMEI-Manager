import React, { useEffect, useState } from "react";
import {
  PrinterOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Row, Col, Typography, Button, Space } from "antd";

import ModalPrint from "../Print/ModalPrint";
import { useDispatch, useSelector } from "react-redux";
import {
  get_singleProduct,
  remove_singleUser,
} from "../../features/products/productSlice";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

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

  /* For Print */
  const [isModalOpen, setIsModalOpen] = useState(false);
  /* End For Print */

  const deleteUser = (id, phone) => {
    dispatch(remove_singleUser({ id, phone }));
  };

  const dataProduct = products && (
    <div className="imei-item-head">
      <Title level={4}>{products.productTitle || ""}</Title>
      <Space size={30}>
        <Text>
          <Text strong>Phân loại: </Text>
          {products.variantTitle || "Chưa có dữ liệu"}
        </Text>
        <Text>
          <Text strong>Mã IMEI: </Text>
          {products.codeIMEI || "Chưa có dữ liệu"}
        </Text>
        <Text>
          <Text strong>Thời gian bảo hành: </Text>
          {products.timeGuarantee || "Chưa có dữ liệu"}
        </Text>
        <Space size={15}>
          {products.codeIMEI !== "" ? (
            <>
              <Button type="text" onClick={(e) => setIsModalOpen(true)}>
                <PrinterOutlined />
                In
              </Button>
              <ModalPrint
                value={products}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            </>
          ) : (
            // <Button type="text" onClick={onSave}>
            //   <SaveOutlined /> Lưu
            // </Button>
            <></>
          )}
        </Space>
      </Space>
    </div>
  );

  const dataGuarantee =
    products &&
    products.userGuarantee &&
    products.userGuarantee.length > 0 &&
    products.userGuarantee.map((value, key) => (
      <Row className="user-item">
        <Col span={6}>
          <Text>{value.name}</Text>
        </Col>
        <Col span={6}>
          <Text>{value.phone}</Text>
        </Col>
        <Col span={5}>
          <Text>{value.timeStart}</Text>
        </Col>
        <Col span={5}>
          <Text>{value.timeEnd}</Text>
        </Col>
        <Col span={2}>
          <Button
            type="danger"
            icon={<CloseOutlined />}
            onClick={(e) => deleteUser(products._id, value.phone)}
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
        <Col span={6}>
          <Text strong underline>
            Họ và tên
          </Text>
        </Col>
        <Col span={6}>
          <Text strong underline>
            Số điện thoại
          </Text>
        </Col>
        <Col span={5}>
          <Text strong underline>
            Thời gian kích hoạt bảo hành
          </Text>
        </Col>
        <Col span={5}>
          <Text strong underline>
            Thời gian hết hạn bảo hành
          </Text>
        </Col>
        <Col span={2}>
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
