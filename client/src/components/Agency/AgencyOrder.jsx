import { List, Popover } from "antd";
// import ReactToPrint from "react-to-print";
// import AgencyToPrint from "./AgencyToPrint";

function AgencyOrder({ stt, item }) {
  // const componentRef = useRef();
  return (
    <List.Item>
      <Popover content={item.products.productTitle} trigger="hover">
        <a
          rel="noreferrer"
          target="_blank"
          href={`https://zedition.myharavan.com/admin/orders/${item.order}`}
        >
          {stt}. Sản phẩm {item.variant}
        </a>
      </Popover>
      {/* <ReactToPrint
        trigger={() => <Button danger>In</Button>}
        content={() => componentRef.current}
      />
      <div hidden>
        <AgencyToPrint
          ref={componentRef}
          count={1}
          objID={item._id}
          orderID={item.order}
          proID={item.products.productID}
          varID={item.variant}
        />
      </div> */}
    </List.Item>
  );
}

export default AgencyOrder;
