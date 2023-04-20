import { Row, Col, Modal, Button, Space, Popconfirm, List } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { delete_singleNotify } from "../../features/notify/notifySlice";

function NotifyItem({ stt, data }) {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onDeleteNotify = async (id) => {
    dispatch(delete_singleNotify({ id }));
  };
  return (
    <Space size={50}>
      {data.message}
      <Popconfirm
        placement="left"
        title="Bạn có chắc đã hoàn thành thông báo này?"
        onConfirm={(e) => onDeleteNotify(data._id)}
        okText="Tiếp tục"
        cancelText="Bỏ qua" 
      >
        <Button type="text" danger size="small">
          Hoàn thành?
        </Button>
      </Popconfirm>
      <Modal
        title="Cấu hình thông báo"
        centered
        open={isModalOpen}
        footer={null}
        onCancel={(e) => setIsModalOpen(false)}
      ></Modal>
    </Space>
  );
}

export default NotifyItem;
