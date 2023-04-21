import { Input, Pagination, Divider, List } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_allClients, resetClient } from "../../features/client/clientSlice";
import { toast } from "react-toastify";
import AgencyItem from "../Agency/AgencyItem";

function ManagerAgency() {
  const [dataSearch, setDataSearch] = useState("");

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
        filter: { key: String(dataSearch), agency: true },
        limit,
        paginate,
      })
    );
    dispatch(resetClient());
  }, [
    dataSearch,
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
      renderItem={(client) => <AgencyItem client={client} />}
    />
  );

  return (
    <Content className="dashboard-product">
      <Input.Search
        addonBefore="Đại lý: "
        placeholder="Nhập tên đại lý..."
        enterButton
        defaultValue={dataSearch}
        onSearch={(value) => setDataSearch(value)}
      />
      <Divider orientation="left">Danh sách đại lý</Divider>
      {clientItems}
    </Content>
  );
}

export default ManagerAgency;
