import { useRef } from "react";

import ReactToPrint from "react-to-print";
import ComponentToPrint from "./ComponentToPrint";
import { PrinterOutlined } from "@ant-design/icons";
import { Space, Button } from "antd";

function ToPrint({ dataPrint }) {
  const componentRef = useRef();
  return (
    <div className="toPrint">
      <ReactToPrint
        trigger={() => (
          <Button htmlType="submit" type="primary" icon={<PrinterOutlined />}>
            In
          </Button>
        )}
        content={() => componentRef.current}
      />
      <div hidden>
        <ComponentToPrint
          ref={componentRef}
          count={dataPrint.count}
          agency={dataPrint.agency}
          proID={dataPrint.proID}
          varID={dataPrint.varID}
        ></ComponentToPrint>
      </div>
    </div>
  );
}

export default ToPrint;
