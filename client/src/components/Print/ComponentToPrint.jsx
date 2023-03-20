import { Col, QRCode, Row, Space, Typography } from "antd";
import { forwardRef } from "react";

const { Text } = Typography;

const ComponentToPrint = forwardRef((props, ref) => {
  const buildUrl = `https://lt-ecommerce.myharavan.com/pages/qr-code?imei=${props.codeIMEI}&varid=${props.variantID}`;
  // https://lt-ecommerce.myharavan.com/pages/qr-code?imei=123&varid=1099843783
  return (
    <Row ref={ref}>
      <Col span={10}>
        <QRCode bordered={false} size={100} value={buildUrl} errorLevel="H" />
      </Col>
      <Col span={12}>
        <Space direction="vertical" size={5} style={{ paddingTop: "12px" }}>
          <Text strong>{props.codeIMEI}</Text>
          <Text strong>{props.variantID}</Text>
        </Space>
      </Col>
    </Row>
  );
});

export default ComponentToPrint;
