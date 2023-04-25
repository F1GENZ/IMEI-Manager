import {
  AlertOutlined,
  DatabaseOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Descriptions, Space, Form, Checkbox, Button, Typography } from "antd";
import ReactToPrint from "react-to-print";
import AgencyToPrints from "./AgencyToPrints";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { active_allAgency } from "../../features/clientSlice";
import { socket } from "../..";
import { Content } from "antd/es/layout/layout";

function AgencyOrder({ data }) {
  const [startActive, setStartActive] = useState({
    state: false,
    text: "Kích hoạt tất cả",
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
    socket.emit("active-agency", newData);
    socket.on("done-active-agency", (data) => {
      dispatch(active_allAgency(data));
      socket.off("done-active-agency");
    });
    setStartActive({
      state: false,
      text: "Kích hoạt tất cả",
    });
  };

  return (
    <Form onFinish={(value) => onActive(value)}>
      <Space className="d-flex" direction="vertical">
        <Space className="d-flex" style={{ justifyContent: "space-between" }}>
          <Space>
            <DatabaseOutlined size="small" />
            <Typography.Text strong>Đơn hàng số {data.order}</Typography.Text>
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
                  text: "Chờ kích hoạt...",
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
              <AgencyToPrints ref={componentRef} data={data} />
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
                })`}
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

export default AgencyOrder;
