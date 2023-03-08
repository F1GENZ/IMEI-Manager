import React, { useState } from "react";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";
import { Row, Col, Typography, Input, Button } from "antd";

const { Text } = Typography;

function ManagerDetail(props) {
  const [dataImei, setDataImei] = useState("");
  const products = props.products;
  const currentId = window.location.pathname.split("/").reverse()[0];
  const filterData =
    products &&
    products.filter((el) => {
      return el._id === currentId;
    });

  const onSave = () => {
    // setData({
    //   ...data,
    //   imei: dataImei,
    // });
  };

  return (
    <>
      {filterData &&
        filterData.map((value, key) => (
          <div className="imei-item" key={key}>
            <div className="imei-item-head">
              <h3>{value.title && value.title}</h3>
              <span>
                <strong>Phân loại: </strong>
                {value.variantTitle && value.variantTitle}
              </span>
              <span>
                <strong>Mã IMEI: </strong>
                {value.imei ? (
                  value.imei
                ) : (
                  <Input
                    defaultValue={dataImei}
                    bordered={false}
                    style={{ width: "250px" }}
                    placeholder="Nhập mã IMEI cho sản phẩm"
                    onChange={(e) => setDataImei(e.target.value)}
                  />
                )}
              </span>
              <span>
                {value.imei ? (
                  <Button type="text" onClick={onSave}>
                    <EditOutlined />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Button type="text" onClick={onSave}>
                    <SaveOutlined /> Lưu
                  </Button>
                )}
              </span>
            </div>
            <div className="imei-item-body">
              <h3>Danh sách bảo hành: </h3>
              {value.guarantee && value.guarantee.length > 0 ? (
                <Row key="" gutter={30}>
                  <Col span={6}>
                    <Text strong underline>
                      Số điện thoại
                    </Text>
                  </Col>
                  <Col span={6}>
                    <Text strong underline>
                      Thời hạn bảo hành
                    </Text>
                  </Col>
                  <Col span={6}>
                    <Text strong underline>
                      Tình trạng bảo hành
                    </Text>
                  </Col>
                  <Col span={6}>
                    <Text strong underline>
                      Thao tác
                    </Text>
                  </Col>
                </Row>
              ) : (
                <>Chưa có dữ liệu bảo hành cho sản phẩm này</>
              )}
            </div>
          </div>
        ))}
    </>
  );
}

export default ManagerDetail;
