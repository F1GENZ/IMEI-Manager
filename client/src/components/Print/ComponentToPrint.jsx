import { Row, Col } from "antd";
import { forwardRef } from "react";
import QRCode from "qrcode.react";

const ComponentToPrint = forwardRef((props, ref) => {
  const buildUrl = `https://zedition.vn/pages/client?varid=${props.varID}`;
  let domPrint = [];
  for (let i = 0; i < props.count; i++) {
    domPrint.push(
      <Col
        key={i}
        span={8}
        className="d-flex"
        style={{ padding: "0 5px 0 10px", alignItems: "center" }}
      >
        <QRCode
          renderAs="svg"
          value={buildUrl}
          size={80}
          level="L"
          includeMargin
          imageSettings={{
            src: "/logoZ.png",
            width: 17.5,
            height: 17.5,
          }}
        />
        <p
          style={{
            width: "45px",
            margin: 0,
            fontSize: "7px",
            textAlign: "center",
          }}
        >
          {Number(props.agency) !== 0 && (
            <strong style={{ display: "block" }}>{props.agency}</strong>
          )}
          <strong style={{ display: "block" }}>{props.varID}</strong>
          <strong style={{ display: "block" }}>
            Quét mã QR để kích hoạt bảo hành
          </strong>
        </p>
      </Col>
    );
  }

  return (
    <div ref={ref}>
      <Row>{domPrint}</Row>
    </div>
  );
});

export default ComponentToPrint;
