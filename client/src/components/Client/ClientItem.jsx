import {
  List,
  Collapse,
  Space,
  Typography,
  Button,
  Popover,
  Popconfirm,
} from "antd";
import moment from "moment";
import ModalToClient from "./ModalToClient";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { delete_singleClients } from "../../features/clientSlice";

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

  const onDeleteClient = async (parent, child) => {
    dispatch(delete_singleClients({ parent, child }));
  };
  /* End Modal */
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
              {client.agencyName && (
                <Space>
                  <Text strong>Từ đại lý:</Text>
                  {client.agencyName || "Chưa có thông tin"}
                </Space>
              )}
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
          <List
            direction="vertical"
            dataSource={client.data}
            renderItem={(item) => (
              <List.Item>
                <Popover content={item.products.productTitle} trigger="hover">
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={`https://zedition.myharavan.com/admin/orders/${item.order}`}
                  >
                    Sản phẩm {item.variant} - Đơn hàng {item.order} - Số lượng{" "}
                    {item.quantity} - Bảo hành tới{" "}
                    {moment(item.timeEnd).format("DD/MM/YYYY")} - Số lần bảo
                    hành {item.countGuarantee}
                  </a>
                </Popover>
                <Popconfirm
                  placement="left"
                  title="Bạn có chắc muốn hủy mã bảo hành này?"
                  onConfirm={(e) => onDeleteClient(client._id, item._id)}
                  okText="Tiếp tục"
                  cancelText="Bỏ qua"
                >
                  <Button type="text" danger>
                    Hủy
                  </Button>
                </Popconfirm>
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
    </List.Item>
  );
}

export default ClientItem;
