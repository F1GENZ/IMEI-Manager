import {
  Col,
  Row,
  Input,
  DatePicker,
  Pagination,
  Divider,
  List,
  Switch,
  Space,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_allClients, resetClient } from "../../features/clientSlice";
import { toast } from "react-toastify";
import ClientItem from "../Client/ClientItem";
import { socket } from "../..";

const { RangePicker } = DatePicker;

function Manager_User() {
  const [dataFilter, setDataFilter] = useState({
    key: "",
    time: [],
    agency: false,
    noname: "No",
    limit: 9,
    paginate: 1,
  });
  const { clients, messageClient } = useSelector((state) => state.client);
  const dispatch = useDispatch();

  useEffect(() => {
    messageClient && toast.info(messageClient);

    socket.emit("get-clients", dataFilter);

    socket.on("done-get-clients", (data) => {
      dispatch(get_allClients(data));
    });

    socket.on("done-create-clients-wh", (data) => {
      toast.info(data);
      socket.emit("get-clients", dataFilter);
    });

    socket.on("done-create-clients-web", (data) => {
      console.log(data);
      toast.info("Bạn có một kích hoạt bảo hành mới");
      socket.emit("get-clients", dataFilter);
    });

    dispatch(resetClient());
    return () => {
      socket.off("done-get-clients");
      socket.off("done-create-clients-wh");
      socket.off("done-create-clients-web");
    };
  }, [dataFilter, dispatch, messageClient]);

  const clientItems = clients && clients.response && (
    <List
      className="listUser"
      footer={
        clients.totalPages > dataFilter.limit &&
        clients.totalPages && (
          <Pagination
            defaultPageSize={dataFilter.limit}
            defaultCurrent={dataFilter.paginate}
            total={clients.totalPages}
            onChange={(page, pageSize) => {
              setDataFilter((prev) => ({ ...prev, paginate: page }));
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
      setDataFilter((prevState) => ({ ...prevState, time: [] }));
    } else {
      setDataFilter((prevState) => ({ ...prevState, time: dateStrings }));
    }
  };

  return (
    <Content className="dashboard-product">
      <Row gutter={[15, 15]} style={{ alignItems: "center" }}>
        <Col lg={15} md={24} sm={24} xs={24}>
          <Input.Search
            addonBefore="Khách hàng: "
            placeholder="Nhập tên người dùng..."
            enterButton
            defaultValue={dataFilter.key}
            onSearch={(value) =>
              setDataFilter((prevState) => ({ ...prevState, key: value }))
            }
          />
        </Col>
        <Col lg={5} md={24} sm={24} xs={24}>
          <RangePicker
            inputReadOnly
            onChange={(dates, dateStrings) => handlePicker(dates, dateStrings)}
          />
        </Col>
        <Col lg={4} md={24} sm={24} xs={24}>
          <Space>
            Khách hàng vãng lai
            <Switch
              onChange={(checked) =>
                checked
                  ? setDataFilter((prevState) => ({
                      ...prevState,
                      noname: "Yes",
                    }))
                  : setDataFilter((prevState) => ({
                      ...prevState,
                      noname: "No",
                    }))
              }
            />
          </Space>
        </Col>
      </Row>
      <Divider orientation="left">Danh sách người dùng</Divider>
      {clientItems}
    </Content>
  );
}

export default Manager_User;
