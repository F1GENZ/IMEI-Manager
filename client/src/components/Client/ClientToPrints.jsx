import { Row, Col } from "antd";
import { forwardRef } from "react";
import QRCode from "qrcode.react";

const ClientToPrints = forwardRef((props, ref) => {
  let { data } = props;
  let domPrint = [];
  for (let i = 0; i < data.list.length; i++) {
    for (let j = 0; j < +data.list[i].quantity; j++) {
      const buildUrl = `https://zedition.vn/pages/client?varid=${data.list[i].variant}`;
      // https://zedition.vn/pages/client?varid=1095774211
      domPrint.push(
        <Col
          key={i}
          span={8}
          className="d-flex"
          style={{
            padding: "0 5px 0 10px",
            alignItems: "center",
            position: "relative",
          }}
        >
          <QRCode
            renderAs="svg"
            value={buildUrl}
            size={80}
            level="L"
            includeMargin
            imageSettings={{
              src: "/logoZ.png",
              width: 15,
              height: 15,
            }}
          />
          <span
            style={{
              position: "absolute",
              right: "5px",
              bottom: "5px",
              fontSize: "7px",
              lineHeight: 1,
            }}
          >
            {i + 1}
          </span>
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
  }

  return (
    <div ref={ref}>
      <Row>{domPrint}</Row>
    </div>
  );
});

export default ClientToPrints;
