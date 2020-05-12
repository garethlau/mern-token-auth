import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
import { getAccessToken, setAccessToken } from "./accessToken";
import { BASE_API_URL } from "./constants";

axios.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    let accessToken = getAccessToken();
    config.headers["authorization"] = `Bearer ${accessToken}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest.url.includes("/api/auth/refresh-token")
    ) {
      // The failed response is from the refresh token endpoint, do not retry
      return Promise.reject(error);
    }

    // Failed authentication and have not yet retried this request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Attempt to refresh token
      return axios
        .post(`${BASE_API_URL}/api/auth/refresh-token`)
        .then((res) => {
          setAccessToken(res.data.accessToken);
          // Retry the original request
          return axios(originalRequest);
        });
    }

    // Return the error if we have already retried the original request
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
