import { Col, QRCode, Row, Space, Typography } from "antd";
import { forwardRef } from "react";

const { Text } = Typography;

const ComponentToPrint = forwardRef((props, ref) => {
  const buildUrl = `https://lt-ecommerce.myharavan.com/pages/guarantee?objectid=${props.objectID}&imei=${props.codeIMEI}&varid=${props.variantID}`;
  console.log(buildUrl);
  return (
    <Row ref={ref} gutter={15}>
      <Col lg={6} md={7} sm={8} xs={9}>
        <QRCode bordered={false} size={120} value={buildUrl} errorLevel="L" />
      </Col>
      <Col lg={18} md={17} sm={16} xs={15}>
        <Space direction="vertical" size={5} style={{ paddingTop: "12px" }}>
          <Text strong>{props.codeIMEI}</Text>
          <Text strong>{props.variantID}</Text>
        </Space>
      </Col>
    </Row>
  );
});

export default ComponentToPrint;
