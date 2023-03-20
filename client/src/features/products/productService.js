import axios from "axios";

const API_URL = "http://localhost:5000/embed/products";

const call_allProducts = async (data) => {
  const response = await axios.get(`${API_URL}/all`, {
    params: { filter: data },
  });
  return response.data;
};

const call_singleProduct = async (data) => {
  const response = await axios.get(`${API_URL}/all/${data}`);
  return response.data;
};

const delete_singleUser = async (data) => {
  const response = await axios.put(`${API_URL}/all/user/delete?id=${data.id}&phone=${data.phone}`);
  return response.data;
};

const productServices = {
  call_allProducts,
  call_singleProduct,
  delete_singleUser,
};

export default productServices;
