import React, { useState } from "react";
import axios from "axios";
import { setAccessToken } from "../accessToken";
import { BASE_API_URL } from "../constants";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    const data = {
      username,
      password,
    };
    try {
      let result = await axios.post(`${BASE_API_URL}/api/auth/signup`, data, {
        withCredentials: true,
      });
      const { accessToken } = result.data;
      console.log("Access token: " + accessToken);
      if (accessToken) {
        setAccessToken(accessToken);
      }
      // Fetch for the user now?
      // Redirect?
      // Show a success message?
    } catch (err) {
      // Handle error
      console.log(err.message);
    }
  }
  return (
    <div>
      <h1>Sign up</h1>
      <div>
        <input
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={submit}>Submit</button>
    </div>
  );
}
