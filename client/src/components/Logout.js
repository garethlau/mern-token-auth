import React from "react";
import axios from "axios";
import { setAccessToken } from "../accessToken";
import { BASE_API_URL } from "../constants";

export default function Logout() {
  async function logoutOne() {
    setAccessToken("");
    try {
      let res = await axios.post(`${BASE_API_URL}/api/auth/logout`);
      console.log(res);
    } catch (err) {
      console.log(err.message);
    }
  }

  async function logoutAll() {
    setAccessToken("");
    try {
      let res = await axios.post(`${BASE_API_URL}/api/auth/logout-all`);
      console.log(res);
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div>
      <button onClick={logoutOne}>Logout</button>
      <button onClick={logoutAll}>Logout of all devices</button>
    </div>
  );
}
