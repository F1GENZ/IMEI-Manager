import { List, Collapse, Space, Typography, Button } from "antd";
import { useState } from "react";
import ModalToClient from "../Client/ModalToClient";
import AgencyOrder from "./AgencyOrder";

const { Text } = Typography;
const { Panel } = Collapse;

function AgencyItem({ client }) {
  /* Modal */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataClient, setDataClient] = useState({});
  const onUpdateUser = (id, name, phone) => {
    setDataClient({ id, name, phone });
    setIsModalOpen(true);
  };
  /* End Modal */

  const headerPanel = (
    <Space size={30}>
      <Space>
        <Text strong>Họ và tên:</Text>
        {client.name || "Khách hàng vãng lai"}
      </Space>
      <Space>
        <Text strong>Số điện thoại:</Text>
        {client.phone || "Chưa có thông tin"}
      </Space>
      {(!client.name || !client.phone) && (
        <Button
          danger
          size="small"
          onClick={() => onUpdateUser(client._id, client.name, client.phone)}
        >
          Cập nhật
        </Button>
      )}
    </Space>
  );

  const newData =
    client &&
    client.data &&
    client.data.length > 0 &&
    client.data.reduce((result, current, curIndex) => {
      if (curIndex === 0) result = [];
      const filterTask = result.filter((el) => {
        return el.order === current.order;
      })[0];
      if (filterTask) {
        filterTask.list.push(current);
      } else {
        result.push({
          _id: client._id,
          name: client.name,
          variant: current.variant,
          product: current.products ? current.products.productID : null,
          order: current.order,
          list: [current],
        });
      }
      return result;
    }, []);
  return (
    <List.Item>
      <ModalToClient
        dataClient={dataClient}
        setDataClient={setDataClient}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <Collapse ghost size="small" expandIconPosition="end" collapsible="icon">
        <Panel header={headerPanel}>
          {newData &&
            newData.map((item, key) => <AgencyOrder key={key} data={item} />)}
        </Panel>
      </Collapse>
    </List.Item>
  );
}

export default AgencyItem;
