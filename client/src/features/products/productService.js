import axios from "axios";

const accessToken = localStorage.getItem("accessToken");
//const API_URL = "http://localhost:5000/embed/products";
const API_URL = "https://imei-manager-zqz6j.ondigitalocean.app/embed/products";

const call_allProducts = async (data) => {
  const response = await axios.get(`${API_URL}/all`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: data,
  });
  return response.data;
};

const call_singleProduct = async (data) => {
  const response = await axios.get(`${API_URL}/all/${data}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const update_singleProduct = async (data) => {
  const response = await axios.put(
    `${API_URL}/all/update/${data.id}?timeGuarantee=${data.timeGuarantee}`
  );
  return response.data;
};

const delete_singleUser = async (data) => {
  const response = await axios.put(
    `${API_URL}/all/deleteUser/${data.productID}?clientid=${data.clientID}`
  );
  return response.data;
};

const productServices = {
  call_allProducts,
  call_singleProduct,
  update_singleProduct,
  delete_singleUser,
};

export default productServices;
