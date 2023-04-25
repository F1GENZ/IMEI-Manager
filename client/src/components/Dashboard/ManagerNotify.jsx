import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_allNotify, resetNotify } from "../../features/notifySlice";
import { toast } from "react-toastify";
import { Divider, List, Space } from "antd";
import NotifyItem from "../Notify/NotifyItem";
import { Content } from "antd/es/layout/layout";
import { socket } from "../..";

function ManagerNotify() {
  const dispatch = useDispatch();
  const { notify } = useSelector((state) => state.notify);
  useEffect(() => {
    socket.emit("get-notify");

    socket.on("done-get-notify", (data) => {
      dispatch(get_allNotify(data));
    });

    socket.on("done-create-notify", (data) => {
      toast.info(data);
      socket.emit("get-notify");
    });

    dispatch(resetNotify());
    return () => {
      socket.off("done-get-notify");
      socket.off("done-create-notify");
    };
  }, [dispatch]);

  const listNotify = notify && notify.data && (
    <List
      itemLayout="vertical"
      bordered
      dataSource={notify.data}
      renderItem={(value) => (
        <List.Item>
          <NotifyItem key={value._id} data={value} />
        </List.Item>
      )}
    />
  );

  return (
    <Content>
      <Divider orientation="left">Danh sách thông báo</Divider>
      <Space className="d-flex" direction="vertical">
        {listNotify}
      </Space>
    </Content>
  );
}

export default ManagerNotify;
