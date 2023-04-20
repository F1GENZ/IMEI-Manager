import { List, Collapse, Space, Typography, Button, Divider } from "antd";
import { useRef, useState } from "react";

import ReactToPrint from "react-to-print";
import AgencyToPrints from "./AgencyToPrints";
import ModalToClient from "../Client/ModalToClient";
import AgencyOrder from "./AgencyOrder";

const { Text } = Typography;
const { Panel } = Collapse;

function AgencyItem({ client }) {
  const componentRef = useRef();
  /* Modal */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataClient, setDataClient] = useState({});
  const onUpdateUser = (id, name, phone) => {
    setDataClient({ id, name, phone });
    setIsModalOpen(true);
  };
  /* End Modal */

  const newData =
    client &&
    client.data &&
    client.data.reduce((result, current, curIndex) => {
      if (curIndex === 0) result = [];
      const filterTask = result.filter((el) => {
        return el.order === current.order;
      })[0];
      if (filterTask) {
        filterTask.list.push(current);
      } else {
        result.push({
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
        <Panel
          header={
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
                  onClick={() =>
                    onUpdateUser(client._id, client.name, client.phone)
                  }
                >
                  Cập nhật
                </Button>
              )}
            </Space>
          }
        >
          {/* {client.data.length > 0 && (
            <Divider orientation="right" orientationMargin={20}>
              <ReactToPrint
                trigger={() => <Button danger>In tất cả</Button>}
                content={() => componentRef.current}
              />
              <div hidden>
                <AgencyToPrints ref={componentRef} data={client.data} />
              </div>
            </Divider>
          )} */}
          <List
            direction="horizontal"
            dataSource={newData}
            renderItem={(item) => (
              <Space className="d-flex" direction="vertical" size={0}>
                <Divider orientation="left"><small>Đơn hàng số {item.order}</small></Divider>
                {item.list.map((element, key) => (
                  <AgencyOrder key={key} stt={key} item={element} />
                ))}
              </Space>
            )}
          />
        </Panel>
      </Collapse>
    </List.Item>
  );
}

export default AgencyItem;
