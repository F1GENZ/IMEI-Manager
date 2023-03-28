import { Col, QRCode, Row, Space, Typography } from "antd";
import { forwardRef } from "react";

const { Text } = Typography;

const ComponentToPrint = forwardRef((props, ref) => {
  const buildUrl = `https://lt-ecommerce.myharavan.com/pages/guarantee?objectid=${props.objectID}&imei=${props.codeIMEI}&varid=${props.variantID}`;
  // https://lt-ecommerce.myharavan.com/pages/guarantee?objectid=641aa96d624b93d0d93fc7ce&imei=1045186807&varid=1099843783
  console.log(buildUrl);
  return (
    <Row ref={ref}>
      <Col span={10}>
        <QRCode bordered={false} size={100} value={buildUrl} errorLevel="L" />
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
