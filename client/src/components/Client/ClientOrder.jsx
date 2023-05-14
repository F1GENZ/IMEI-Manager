import {
  AlertOutlined,
  DatabaseOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Space, Form, Checkbox, Button, Typography } from "antd";
import ReactToPrint from "react-to-print";
import ClientToPrints from "./ClientToPrints";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { delete_singleClients } from "../../features/clientSlice";
import { socket } from "../..";
import { Content } from "antd/es/layout/layout";

function ClientOrder({ data }) {
  const [startActive, setStartActive] = useState({
    state: false,
    text: "Hủy bảo hành",
  });
  const componentRef = useRef();
  const dispatch = useDispatch();

  const onActive = (value) => {
    let listValue = Object.values(value);
    let newData = {
      ...data,
      list: data.list.filter((element, key) => {
        return listValue[key] === true;
      }),
    };
    socket.emit("delete-client", newData);
    socket.on("done-delete-client", (data) => {
      dispatch(delete_singleClients(data));
      socket.off("done-delete-client");
    });
    setStartActive({
      state: false,
      text: "Hủy bảo hành",
    });
  };

  return (
    <Form onFinish={(value) => onActive(value)}>
      <Space className="d-flex" direction="vertical">
        <Space className="d-flex" style={{ justifyContent: "space-between" }}>
          <Space>
            <DatabaseOutlined size="small" />
            <Typography.Text strong>
              <a
                rel="noreferrer"
                target="_blank"
                href={`https://zedition.myharavan.com/admin/orders/${data.order}`}
              >
                Đơn hàng số {data.order}
              </a>
            </Typography.Text>
          </Space>
          <Content>
            <Button
              className="setActiveAll"
              size="small"
              danger
              icon={<AlertOutlined />}
              onClick={() =>
                setStartActive({
                  state: true,
                  text: "Chờ xác nhận...",
                })
              }
            >
              {startActive.text}
            </Button>
            <ReactToPrint
              trigger={() => (
                <Button size="small" type="primary" icon={<PrinterOutlined />}>
                  In tất cả
                </Button>
              )}
              content={() => componentRef.current}
            />
            <div hidden>
              <ClientToPrints ref={componentRef} data={data} />
            </div>
          </Content>
        </Space>
        <Space className="d-flex" direction="vertical" size={0}>
          {data &&
            data.list &&
            data.list.length > 0 &&
            data.list.map((element, key) => (
              <Form.Item
                style={{ marginBottom: "0" }}
                label={`${key + 1}. ${element.products.productTitle} (${
                  element.variant
                }) - Số lượng ${element.quantity}`}
                name={`isCheck${key}`}
                valuePropName="checked"
                initialValue={true}
              >
                {startActive.state && (
                  <Checkbox defaultChecked={true}></Checkbox>
                )}
              </Form.Item>
            ))}
        </Space>
        {startActive.state && (
          <Space className="d-flex" style={{ justifyContent: "end" }}>
            <Button
              style={{ marginBottom: "15px" }}
              danger
              onClick={() =>
                setStartActive({
                  state: false,
                  text: "Kích hoạt tất cả",
                })
              }
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginBottom: "15px" }}
            >
              Xác nhận
            </Button>
          </Space>
        )}
      </Space>
    </Form>
  );
}

export default ClientOrder;
