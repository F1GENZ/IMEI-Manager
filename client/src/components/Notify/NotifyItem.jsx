import { Modal, Button, Space, Popconfirm } from "antd";
import React, { useState } from "react";
import { socket } from "../..";
import { toast } from "react-toastify";

function NotifyItem({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onDeleteNotify = async (id) => {
    socket.emit("delete-notify", id);

    socket.on("done-delete-notify", (data) => {
      toast.info(data);
      socket.emit("get-notify");
      socket.off("done-delete-notify");
    });
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
