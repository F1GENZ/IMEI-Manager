import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.scss";

import { io } from "socket.io-client";

//export const socket = io("https://imei-manager-zqz6j.ondigitalocean.app");
export const socket = io("http://localhost:5000");
socket.emit("authentication", localStorage.getItem("accessToken"));
socket.on("notAuthor", (data) => {
  window.location.href = "https://zedition.myharavan.com/";
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
