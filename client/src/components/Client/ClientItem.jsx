import {
  List,
  Collapse,
  Space,
  Typography,
  Button,
  Row,
  Col,
  Popconfirm,
} from "antd";
import ModalToClient from "./ModalToClient";
import { useState } from "react";
import ClientOrder from "./ClientOrder";
import { socket } from "../..";
import { useDispatch } from "react-redux";
import { delete_masterClients } from "../../features/clientSlice";

const { Text } = Typography;
const { Panel } = Collapse;

function ClientItem({ client }) {
  const dispatch = useDispatch();
  /* Modal */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataClient, setDataClient] = useState({});
  const onUpdateUser = (id, name, phone) => {
    setDataClient({ id, name, phone });
    setIsModalOpen(true);
  };
  /* End Modal */

  const headerPanel = (
    <Row gutter={30}>
      <Col span={6}>
        <Space>
          <Text strong>Họ và tên:</Text>
          {client.name || "Khách hàng vãng lai"}
        </Space>
      </Col>
      <Col span={6}>
        <Space>
          <Text strong>Số điện thoại:</Text>
          {client.phone || "Chưa có thông tin"}
        </Space>
      </Col>
      <Col span={6}>
        {client.agencyName && (
          <Space>
            <Text strong>Từ đại lý:</Text>
            {client.agencyName || "Chưa có thông tin"}
          </Space>
        )}
      </Col>
      <Col span={6}>
        <Space className="d-flex" direction="horizontal">
          <Popconfirm
            placement="left"
            title="Bạn có chắc muốn xóa khách hàng này?"
            onConfirm={(e) => {
              socket.emit("delete-master-client", client._id);
              socket.on("done-delete-master-client", (data) => {
                dispatch(delete_masterClients(data));
                socket.off("done-delete-master-client");
              });
            }}
            okText="Xác nhận"
            cancelText="Bỏ qua"
          >
            <Button danger size="small">
              Xóa.!
            </Button>
          </Popconfirm>
          {(!client.name || !client.phone) && (
            <Button
              size="small"
              onClick={() =>
                onUpdateUser(client._id, client.name, client.phone)
              }
            >
              Cập nhật
            </Button>
          )}
        </Space>
      </Col>
    </Row>
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
            newData.map((item, key) => <ClientOrder key={key} data={item} />)}
        </Panel>
      </Collapse>
    </List.Item>
  );
}

export default ClientItem;
