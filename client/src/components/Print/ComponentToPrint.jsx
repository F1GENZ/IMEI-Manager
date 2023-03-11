import { forwardRef } from "react";

const ComponentToPrint = forwardRef((props, ref) => {
  return (
    <div className="qrCode-item" ref={ref}>
      <span>{props.text}</span>
      <img width="80" height="80" src="/qr-imei-manager.png" alt="QR Code" />
    </div>
  );
});

export default ComponentToPrint;