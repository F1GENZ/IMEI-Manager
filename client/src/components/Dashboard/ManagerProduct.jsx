import { Input, Pagination, Divider, List } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_allProducts, resetProduct } from "../../features/productSlice";
import { toast } from "react-toastify";
import { Content } from "antd/es/layout/layout";
import ProductItem from "../Product/ProductItem";
import { socket } from "../..";

function Manager_Product() {
  const [dataFilter, setDataFilter] = useState({
    key: "",
    limit: 7,
    paginate: 1,
  });

  const { products, messageProduct } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    messageProduct && toast.info(messageProduct);

    socket.emit("get-products", dataFilter);

    socket.on("done-get-products", (data) => {
      dispatch(get_allProducts(data));
    });

    socket.on("done-create-products-wh", (data) => {
      toast.info(data);
      socket.emit("get-products", dataFilter);
    });

    socket.on("done-update-products-wh", (data) => {
      toast.info(data);
      socket.emit("get-products", dataFilter);
    });

    socket.on("done-delete-products-wh", (data) => {
      toast.info(data);
      socket.emit("get-products", dataFilter);
    });

    dispatch(resetProduct());

    return () => {
      socket.off("done-get-products");
      socket.off("done-create-products-wh");
      socket.off("done-update-products-wh");
      socket.off("done-delete-products-wh");
    };
  }, [dataFilter, dispatch, messageProduct]);

  const productItems = products && products.response && (
    <List
      className="listProduct"
      footer={
        products.totalPages > dataFilter.limit &&
        products.totalPages && (
          <Pagination
            defaultPageSize={dataFilter.limit}
            defaultCurrent={dataFilter.paginate}
            total={products.totalPages}
            onChange={(page, pageSize) => {
              setDataFilter((prevState) => ({ ...prevState, paginate: page }));
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
        defaultValue={dataFilter.key}
        onSearch={(value) =>
          setDataFilter((prevState) => ({ ...prevState, key: value }))
        }
      />
      <Divider orientation="left">Danh sách sản phẩm</Divider>
      {productItems}
    </Content>
  );
}

export default Manager_Product;
