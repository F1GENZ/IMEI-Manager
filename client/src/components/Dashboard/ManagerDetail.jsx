import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Row, Col, Typography, Input, Button } from "antd";

const { Text } = Typography;

function ManagerDetail() {
  const [data, setData] = useState();
  const [dataImei, setDataImei] = useState("");
  const location = useLocation();
  const currentId = location.pathname.split("/").reverse()[0];
  const { product } = useSelector((state) => state.product);
  useEffect(() => {
    if (product) {
      const filterData =
        product &&
        product.filter((el) => {
          return el._id === currentId;
        });
      setData(filterData[0]);
    }
  }, []);

  const onSave = () => {
    setData({
      ...data,
      imei: dataImei
    });
  };

  return (
    <>
      {data && (
        <div className="imei-item">
          <div className="imei-item-head">
            <h3>{data.title && data.title}</h3>
            <span>
              <strong>Phân loại: </strong>
              {data.variantTitle && data.variantTitle}
            </span>
            <span>
              <strong>Mã IMEI: </strong>
              {data.imei ? (
                data.imei
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
              <Button type="text" onClick={onSave}>
                Lưu
              </Button>
            </span>
          </div>
          <div className="imei-item-body">
            <h3>Danh sách bảo hành: </h3>
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
          </div>
        </div>
      )}
    </>
  );
}

export default ManagerDetail;
