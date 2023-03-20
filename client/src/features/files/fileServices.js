import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/embed/file";
// const API_URL = "https://imei-manager-zqz6j.ondigitalocean.app/embed/file";

const exportAll = async (data) => {
  await axios({
    url: `${API_URL}/export/all`, //your url
    method: "GET",
    responseType: "blob", // important
  }).then((response) => {
    // create file link in browser's memory
    const href = URL.createObjectURL(response.data);

    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "export_all.csv"); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  });
};

const exportNoneImei = async (data) => {
  await axios({
    url: `${API_URL}/export/none-imei`, //your url
    method: "GET",
    responseType: "blob", // important
  })
    .then((response) => {
      // create file link in browser's memory
      const href = URL.createObjectURL(response.data);

      // create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "export_none_imei.csv"); //or any other extension
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    })
    .catch(async (error) => {
      if (error.response && error.response.data) {
        const text = JSON.parse(await new Response(error.response.data).text());
        toast.error(text.message);
      }
    });
};

const fileServices = {
  exportAll,
  exportNoneImei,
};

export default fileServices;
