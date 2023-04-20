import { Modal, Form, Input, Button, Space } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { update_singleClient } from "../../features/client/clientSlice";

function ModalToClient({
  dataClient,
  setDataClient,
  isModalOpen,
  setIsModalOpen,
}) {
  const dispatch = useDispatch();
  return (
    <Modal
      className="modalToClient"
      title="Thông tin người dùng"
      centered
      open={isModalOpen}
      footer={null}
      onCancel={(e) => setIsModalOpen(false)}
    >
      <Form
        initialValues={dataClient}
        onFinish={(value) => dispatch(update_singleClient(value))}
      >
        <Space className="d-flex" direction="vertical">
          <Form.Item noStyle hidden name="id">
            <Input />
          </Form.Item>
          <Form.Item noStyle name="name">
            <Input addonBefore="Họ và tên"/>
          </Form.Item>
          <Form.Item noStyle name="phone">
            <Input addonBefore="Số điện thoại"/>
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Cập nhật
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}

export default ModalToClient;
