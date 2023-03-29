import { PrinterOutlined } from "@ant-design/icons";
import { Modal, Row, Col, Button, Space } from "antd";
import React, { useRef } from "react";
import ComponentToPrint from "./ComponentToPrint";

import ReactToPrint from "react-to-print";

function ModalPrint({ value, isModalOpen, setIsModalOpen }) {
  const componentRef = useRef();
  const myShadow = {
    //boxShadow: "inset -1px 0 0 rgba(38,50,56,.1)",
  };
  return (
    <Modal
      title="Bộ mã QR"
      centered
      open={isModalOpen}
      onCancel={(e) => setIsModalOpen(false)}
      footer={null}
    >
      <Row>
        <Col lg={24} md={24} sm={24} xs={24} style={myShadow}>
          <ComponentToPrint
            ref={componentRef}
            codeIMEI={value.codeIMEI}
            variantID={value.variantID}
            objectID={value._id}
          ></ComponentToPrint>
        </Col>
        {/* <Col lg={12}></Col> */}
      </Row>
      <Space align="end" style={{ display: "flex", justifyContent: "end" }}>
        <ReactToPrint
          trigger={() => {
            return <Button icon={<PrinterOutlined />}>In</Button>;
          }}
          content={() => componentRef.current}
        />
      </Space>
    </Modal>
  );
}

export default ModalPrint;
