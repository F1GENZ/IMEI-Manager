import { Input, Pagination, Divider, List } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_allClients, resetClient } from "../../features/clientSlice";
import { toast } from "react-toastify";
import AgencyItem from "../Agency/AgencyItem";
import { socket } from "../..";

function ManagerAgency() {
  const [dataFilter, setDataFilter] = useState({
    key: "",
    time: [],
    agency: true,
    noname: "No",
    limit: 7,
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

    socket.on("done-update-agency-wh", (data) => {
      toast.info(data);
      socket.emit("get-clients", dataFilter);
    });

    socket.on("done-create-clients-web", (data) => {
      toast.info("Một đơn hàng từ đại lý đã được kích hoạt");
      socket.emit("get-clients", dataFilter);
    });

    dispatch(resetClient());
    return () => {
      socket.off("done-get-clients");
      socket.off("done-create-clients-wh");
      socket.off("done-update-agency-wh");
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
              setDataFilter((prevState) => ({ ...prevState, paginate: page }));
            }}
          />
        )
      }
      bordered
      itemLayout="vertical"
      dataSource={clients.response}
      renderItem={(client) => <AgencyItem client={client} />}
    />
  );

  return (
    <Content className="listAgency">
      <Input.Search
        addonBefore="Đại lý: "
        placeholder="Nhập tên đại lý..."
        enterButton
        defaultValue={dataFilter.key}
        onSearch={(value) =>
          setDataFilter((prevState) => ({ ...prevState, key: value }))
        }
      />
      <Divider orientation="left">Danh sách đại lý</Divider>
      {clientItems}
    </Content>
  );
}

export default ManagerAgency;
