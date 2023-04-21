import {
  Col,
  Row,
  Input,
  DatePicker,
  Pagination,
  Divider,
  List,
  Switch,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_allClients, resetClient } from "../../features/client/clientSlice";
import { toast } from "react-toastify";
import ClientItem from "../Client/ClientItem";

const { RangePicker } = DatePicker;

function Manager_User() {
  /* Filter */
  const [dataSearch, setDataSearch] = useState("");
  const [noName, setNoName] = useState("No");
  const [dateTime, setDateTime] = useState([]);
  /* End Filter */

  const limit = 7;
  const [paginate, setPaginate] = useState(1);
  const { clients, isErrorClient, isSuccessClient, messageClient } =
    useSelector((state) => state.client);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isErrorClient) {
      if (messageClient === "Not authorized")
        window.location.href = "http://zedition.myharavan.com/admin";
      toast.error(messageClient);
    }
    if (isSuccessClient) toast.info(messageClient);
    dispatch(
      get_allClients({
        filter: {
          key: String(dataSearch),
          time: dateTime,
          agency: false,
          noname: noName,
        },
        limit,
        paginate,
      })
    );
    dispatch(resetClient());
  }, [
    noName,
    dataSearch,
    dateTime,
    dispatch,
    isSuccessClient,
    isErrorClient,
    messageClient,
    limit,
    paginate,
  ]);

  const clientItems = clients && clients.response && (
    <List
      className="listUser"
      footer={
        clients.totalPages > limit &&
        clients.totalPages && (
          <Pagination
            defaultPageSize={limit}
            defaultCurrent={paginate}
            total={clients.totalPages}
            onChange={(page, pageSize) => {
              setPaginate(page);
            }}
          />
        )
      }
      bordered
      itemLayout="vertical"
      dataSource={clients.response}
      renderItem={(client) => <ClientItem client={client} />}
    />
  );

  const handlePicker = (dates, dateStrings) => {
    if (dateStrings[0] === "" && dateStrings[1] === "") {
      setDateTime([]);
    } else {
      setDateTime(dateStrings);
    }
  };

  return (
    <Content className="dashboard-product">
      <Row gutter={[15, 15]}>
        <Col lg={16} md={24} sm={24} xs={24}>
          <Input.Search
            addonBefore="Khách hàng: "
            placeholder="Nhập tên người dùng..."
            enterButton
            defaultValue={dataSearch}
            onSearch={(value) => setDataSearch(value)}
          />
        </Col>
        <Col lg={6} md={24} sm={24} xs={24}>
          <RangePicker
            inputReadOnly
            onChange={(dates, dateStrings) => handlePicker(dates, dateStrings)}
          />
        </Col>
        <Col lg={2} md={24} sm={24} xs={24}>
          <Switch
            unCheckedChildren="Mặc định"
            checkedChildren="Cập nhật"
            onChange={(checked) =>
              checked ? setNoName("Yes") : setNoName("No")
            }
          />
        </Col>
      </Row>
      <Divider orientation="left">Danh sách người dùng</Divider>
      {clientItems}
    </Content>
  );
}

export default Manager_User;
