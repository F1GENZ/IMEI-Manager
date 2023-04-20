import { Button, Space, Typography } from "antd";
import React, { useState } from "react";
import ModalToPrint from "../Print/ModalToPrint";

const { Text } = Typography;

function VariantItem({ product, variant }) {
  /* For Print */
  const [dataPrint, setDataPrint] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onCustomPrint = (proID, varID) => {
    let data = {
      proID,
      varID,
      agency: 0,
      count: 1,
    };
    setDataPrint(data);
    setIsModalOpen(true);
  };
  /* End For Print */
  return (
    <Space>
      <Text strong>Phiên bản:</Text>
      {variant.variantTitle} - {variant.variantID}
      <Button
        size="small"
        type="primary"
        onClick={(e) => onCustomPrint(product.productID, variant.variantID)}
      >
        Cấu hình in
      </Button>
      <ModalToPrint
        dataPrint={dataPrint}
        setDataPrint={setDataPrint}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </Space>
  );
}

export default VariantItem;
