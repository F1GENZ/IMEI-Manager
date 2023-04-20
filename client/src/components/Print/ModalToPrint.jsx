import { Form, Input, Space } from "antd";
import Modal from "antd/es/modal/Modal";
import React from "react";
import ToPrint from "./ToPrint";

function ModalToPrint({
  dataPrint,
  setDataPrint,
  isModalOpen,
  setIsModalOpen,
}) {
  const onValuesChangePrint = (item, all) => {
    const data = { ...all };
    data.count = Number(all.count);
    setDataPrint(data);
  };

  return (
    <Modal
      title="Cấu hình mẫu in"
      centered
      open={isModalOpen}
      footer={null}
      onCancel={(e) => setIsModalOpen(false)}
    >
      <Form
        onValuesChange={(item, all) => onValuesChangePrint(item, all)}
        initialValues={{
          proID: dataPrint.proID,
          varID: dataPrint.varID,
          count: dataPrint.count,
          agency: 0,
        }}
      >
        <Space className="d-flex" direction="vertical">
          <Form.Item noStyle name="proID">
            <Input addonBefore="ProductID" disabled />
          </Form.Item>
          <Form.Item noStyle name="varID">
            <Input addonBefore="VariantID" disabled />
          </Form.Item>
          <Form.Item noStyle name="count">
            <Input type="number" addonBefore="Số lượng" />
          </Form.Item>
          <ToPrint dataPrint={dataPrint} />
        </Space>
      </Form>
    </Modal>
  );
}

export default ModalToPrint;
