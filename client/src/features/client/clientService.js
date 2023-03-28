import axios from "axios";

//const API_URL = "http://localhost:5000/embed/clients";
const API_URL = "https://imei-manager-zqz6j.ondigitalocean.app/embed/clients";

const call_allClients = async (data) => {
  const response = await axios.get(`${API_URL}/all`, {
    params: data,
  });
  return response.data;
};

const clientServices = {
  call_allClients,
};

export default clientServices;
