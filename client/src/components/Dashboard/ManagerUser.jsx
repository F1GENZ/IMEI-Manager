import { useNavigate } from "react-router-dom";
import {
  Typography,
  Col,
  Row,
  Input,
  Empty,
  Space,
  Button,
  DatePicker,
  Pagination,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_allClients } from "../../features/client/clientSlice";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import moment from "moment";

const { Text } = Typography;
const { RangePicker } = DatePicker;

function Manager_User() {
  const navigate = useNavigate();

  /* Filter */
  const [dataSearch, setDataSearch] = useState("");
  const [dateTime, setDateTime] = useState([]);
  /* Filter */

  const limit = 7;
  const [paginate, setPaginate] = useState(1);
  const { clients, isLoadingClient, isErrorClient, messageClient } =
    useSelector((state) => state.client);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isErrorClient) {
      if (messageClient === "Not authorized")
        window.location.href = "http://zedition.myharavan.com/admin";
      toast.error(messageClient);
    }
    dispatch(
      get_allClients({
        filter: { key: String(dataSearch), time: dateTime },
        limit,
        paginate,
      })
    );
  }, [
    dataSearch,
    dateTime,
    dispatch,
    isErrorClient,
    messageClient,
    limit,
    paginate,
  ]);

  const clientItems =
    clients && clients.response && clients.response.length > 0 ? (
      clients.response.map((value, key) => (
        <Row className="product-item" key={key} gutter={30}>
          <Col lg={6} md={24} sm={24} xs={24}>
            <Text strong className="visible-md">
              Họ và tên:
            </Text>
            {value.name || ""}
          </Col>
          <Col lg={6} md={24} sm={24} xs={24}>
            <Text strong className="visible-md">
              Số điện thoại:
            </Text>
            {value.phone || ""}
          </Col>
          <Col lg={12} md={24} sm={24} xs={24}>
            {value.products.map((product, index) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
                key={index}
              >
                <Text strong>
                  {product.codeIMEI} - Bảo hành: {product.timeGuarantee} tháng -
                  Ngày kết thúc: {moment(value.timeEnd).format("DD/MM/YYYY")}
                </Text>
                <Button
                  style={{ marginLeft: "auto" }}
                  type="primary"
                  onClick={(e) => navigate(`/admin/products/${product._id}`)}
                >
                  Xem chi tiết
                </Button>
              </div>
            ))}
          </Col>
        </Row>
      ))
    ) : (
      <Empty description="Chưa có thông tin dữ liệu" />
    );

  const handlePicker = (dates, dateStrings) => {
    if (dateStrings[0] === "" && dateStrings[1] === "") {
      setDateTime([]);
    } else {
      setDateTime(dateStrings);
    }
  };

  return (
    <Space size={15} direction="vertical" className="dashboard-product d-flex">
      <Row gutter={[15, 15]}>
        <Col lg={18} md={24} sm={24} xs={24}>
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
      </Row>
      {isLoadingClient ? (
        <Spinner />
      ) : (
        <Space
          direction="vertical"
          size={15}
          className="dashboard-product-data d-flex"
        >
          <Row className="product-item" gutter={30}>
            <Col lg={6} md={0} sm={0} xs={0}>
              <Text strong>Tên người dùng</Text>
            </Col>
            <Col lg={6} md={0} sm={0} xs={0}>
              <Text strong>Số điện thoại</Text>
            </Col>
            <Col lg={12} md={0} sm={0} xs={0}>
              <Text strong>Sản phẩm đã mua</Text>
            </Col>
          </Row>
          {clientItems}
          {clients && clients.totalPages > limit && clients.totalPages && (
            <Pagination
              defaultPageSize={limit}
              defaultCurrent={paginate}
              total={clients.totalPages}
              onChange={(page, pageSize) => {
                setPaginate(page);
              }}
            />
          )}
        </Space>
      )}
    </Space>
  );
}

export default Manager_User;
