import axios from "axios";

const accessToken = localStorage.getItem("accessToken");
//const API_URL = "http://localhost:5000/embed/notify";
const API_URL = "https://imei-manager-zqz6j.ondigitalocean.app/embed/notify";

const call_allNotify = async () => {
  const response = await axios.get(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const call_deleteNotify = async (data) => {
  const response = await axios.delete(API_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: data,
  });
  return response.data;
};

const notifyServices = {
  call_allNotify,
  call_deleteNotify,
};

export default notifyServices;
