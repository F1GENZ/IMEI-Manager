import {
  AlertOutlined,
  DatabaseOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Space, Form, Checkbox, Button, Typography } from "antd";
import { useReactToPrint } from "react-to-print";
import ClientToPrints from "./ClientToPrints";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { delete_singleClients } from "../../features/clientSlice";
import { socket } from "../..";
import { Content } from "antd/es/layout/layout";

function ClientOrder({ data }) {
  const [startActive, setStartActive] = useState({
    state: false,
    text: "Hủy bảo hành",
  });
  const [startPrint, setStartPrint] = useState({
    state: false,
    text: "Quản lý in",
  });
  const componentRef = useRef(null);
  const [componentPrint, setComponentPrint] = useState(
    <ClientToPrints ref={componentRef} data={data} />
  );
  const dispatch = useDispatch();

  const onActive = (value) => {
    if (startActive.state) {
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
    } else if (startPrint.state) {
      let listValue = Object.values(value);
      let newData = {
        ...data,
        list: data.list.filter((element, key) => {
          return listValue[key] === true;
        }),
      };
      setComponentPrint(<ClientToPrints ref={componentRef} data={newData} />);
      handlePrint();
    }
  };

  const onSetValue = (value, allValue) => {
    let listValue = Object.values(allValue);
    let newData = {
      ...data,
      list: data.list.filter((element, key) => {
        return listValue[key] === true;
      }),
    };
    setComponentPrint(<ClientToPrints ref={componentRef} data={newData} />);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Form
      onFinish={(value) => onActive(value)}
      onValuesChange={(value, allValue) => onSetValue(value, allValue)}
    >
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
            {!startPrint.state && (
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
            )}
            {!startActive.state && (
              <Button
                className="setActiveAll"
                size="small"
                danger
                icon={<AlertOutlined />}
                onClick={() =>
                  setStartPrint({
                    state: true,
                    text: "Chờ xác nhận...",
                  })
                }
              >
                {startPrint.text}
              </Button>
            )}
            <div hidden>{componentPrint}</div>
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
                {(startActive.state || startPrint.state) && (
                  <Checkbox defaultChecked={true}></Checkbox>
                )}
              </Form.Item>
            ))}
        </Space>
        {(startActive.state || startPrint.state) && (
          <Space className="d-flex" style={{ justifyContent: "end" }}>
            <Button
              style={{ marginBottom: "15px" }}
              onClick={() => {
                if (startActive.state) {
                  setStartActive({
                    state: false,
                    text: "Hủy bảo hành",
                  });
                } else if (startPrint.state) {
                  setStartPrint({
                    state: false,
                    text: "Quản lý in",
                  });
                }
              }}
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
