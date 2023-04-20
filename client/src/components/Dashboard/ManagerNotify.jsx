import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_allNotify, resetNotify } from "../../features/notify/notifySlice";
import { toast } from "react-toastify";
import { Divider, List, Space, Typography } from "antd";
import NotifyItem from "../Notify/NotifyItem";
import { Content } from "antd/es/layout/layout";

function ManagerNotify() {
  const dispatch = useDispatch();
  const { notify, isSuccessNotify, isErrorNotify, messageNotify } = useSelector(
    (state) => state.notify
  );
  useEffect(() => {
    if (isErrorNotify) toast.error(messageNotify);
    if (isSuccessNotify) toast.info(messageNotify);
    dispatch(get_allNotify());
    dispatch(resetNotify());
  }, [dispatch, isSuccessNotify, isErrorNotify, messageNotify]);

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
