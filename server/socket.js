import { Server } from "socket.io";
import apiProduct from "./controllers/productController.js";
import apiClient from "./controllers/clientController.js";
import apiNotify from "./controllers/notifyController.js";
import Auth from "./models/authModel.js";

var io;
export function socketActions(server) {
  io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*",
    },
  });
  io.on("connection", async (socket) => {
    //console.log(`${socket.id} is connected`);

    socket.on("authentication", async (data) => {
      const response = await Auth.findOne({ access_token: data });
      if (!response) socket.emit("notAuthor", "Tạm biệt");
    });

    // For Product
    socket.on("get-products", async (data) => {
      const response = await apiProduct.getProducts(data);
      socket.emit("done-get-products", response);
    });

    socket.on("update-product", async (data) => {
      const response = await apiProduct.updateProduct(data);
      socket.emit("done-update-product", response);
    });

    // For Client
    socket.on("get-clients", async (data) => {
      const response = await apiClient.getUsers(data);
      socket.emit("done-get-clients", response);
    });

    socket.on("update-single-client", async (data) => {
      const response = await apiClient.updateClient(data);
      socket.emit("done-update-single-client", response);
    });

    // For Agency
    socket.on("active-agency", async (data) => {
      const response = await apiClient.activeAgency(data);
      socket.emit("done-active-agency", response);
    });

    // For Notify
    socket.on("get-notify", async () => {
      const response = await apiNotify.getNotify();
      socket.emit("done-get-notify", response);
    });

    socket.on("create-notify", async (data) => {
      const response = await apiNotify.createNotify(data);
      socket.emit("done-create-notify", response);
    });

    socket.on("delete-notify", async (data) => {
      const response = await apiNotify.deleteNotify(data);
      socket.emit("done-delete-notify", response);
    });

    // For Website
    socket.on("get-clients-web", async (data) => {
      const response = await apiClient.getUser(data);
      socket.emit("done-get-clients-web", response);
    });

    socket.on("get-flag-clients-web", async (data) => {
      const response = await apiClient.flagClient(data);
      socket.emit("done-get-flag-clients-web", response);
    });

    socket.on("create-clients-web", async (data) => {
      const response = await apiClient.createClient(data);
      socket.emit("done-create-clients-web", response);
    });

    socket.on("disconnect", async (data) => {
      //console.log(`${socket.id} is disconnect`);
    });
  });
  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Missing Socket.IO");
  }
  return io;
}
