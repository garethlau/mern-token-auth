import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../constants";

export default function Protected() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [secretMessage, setSecretMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${BASE_API_URL}/api/auth/protected`)
      .then((res) => {
        console.log(res);
        if (res.data) {
          setSecretMessage(res.data);
        }
        setAuthorized(true);
      })
      .catch((err) => {
        console.log(err.message);
        if (err.response) {
          console.log(err.response);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!authorized) {
    return <div>You are not authorized to see this content</div>;
  } else {
    return (
      <div>
        <h1>{secretMessage}</h1>
      </div>
    );
  }
}
