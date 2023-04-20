import { Input, Pagination, Divider, List } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  get_allProducts,
  resetProduct,
} from "../../features/products/productSlice";
import { toast } from "react-toastify";
import { Content } from "antd/es/layout/layout";
import ProductItem from "../Product/ProductItem";

function Manager_Product() {
  const [dataSearch, setDataSearch] = useState("");
  const limit = 7;
  const [paginate, setPaginate] = useState(1);
  const { products, isSuccessProduct, isErrorProduct, messageProduct } =
    useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isErrorProduct) {
      if (messageProduct === "Not authorized")
        window.location.href = "http://zedition.myharavan.com/admin";
      toast.error(messageProduct);
    }
    if (isSuccessProduct) toast.info(messageProduct);
    dispatch(
      get_allProducts({
        filter: dataSearch,
        limit,
        paginate,
      })
    );
    dispatch(resetProduct());
  }, [
    dataSearch,
    dispatch,
    isSuccessProduct,
    isErrorProduct,
    messageProduct,
    limit,
    paginate,
  ]);

  const productItems = products && products.response && (
    <List
      className="listProduct"
      footer={
        products.totalPages > limit &&
        products.totalPages && (
          <Pagination
            defaultPageSize={limit}
            defaultCurrent={paginate}
            total={products.totalPages}
            onChange={(page, pageSize) => {
              setPaginate(page);
            }}
          />
        )
      }
      bordered
      itemLayout="vertical"
      dataSource={products.response}
      renderItem={(value) => (
        <ProductItem
          key={value.productID}
          dispatch={dispatch}
          product={value}
        />
      )}
    />
  );

  return (
    <Content>
      <Input.Search
        addonBefore="Sản phẩm: "
        placeholder="Nhập tên sản phẩm cần tìm..."
        enterButton
        defaultValue={dataSearch}
        onSearch={(value) => setDataSearch(value)}
      />
      <Divider orientation="left">Danh sách sản phẩm</Divider>
      {productItems}
    </Content>
  );
}

export default Manager_Product;
