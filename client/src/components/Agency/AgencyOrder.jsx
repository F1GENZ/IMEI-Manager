import {
  AlertOutlined,
  DatabaseOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Descriptions, Space, Button } from "antd";
import ReactToPrint from "react-to-print";
import AgencyToPrints from "./AgencyToPrints";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { active_allAgency } from "../../features/client/clientSlice";

function AgencyOrder({ data }) {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const onActiveAll = () => {
    dispatch(active_allAgency(data));
  };
  return (
    <Descriptions
      size="small"
      title={
        <Space>
          <DatabaseOutlined size="small" />
          Đơn hàng số {data.order}
        </Space>
      }
      extra={
        <Space>
          {/* <Button
            size="small"
            danger
            icon={<AlertOutlined />}
            onClick={() => onActiveAll()}
          >
            Kích hoạt tất cả
          </Button> */}
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
        </Space>
      }
    >
      {data.list.map((element, key) => (
        <Descriptions.Item key={key} label={key + 1} span={3}>
          <a
            rel="noreferrer"
            target="_blank"
            href={`https://zedition.myharavan.com/admin/orders/${element.order}`}
          >
            {element.products.productTitle} {element.variant}
          </a>
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
}

export default AgencyOrder;
