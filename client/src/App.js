import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import { setAccessToken } from "./accessToken";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Logout from "./components/Logout";
import Protected from "./components/Protected";
import { BASE_API_URL } from "./constants";

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make POST request to 'refresh-token' endpoint
    axios
      .post(`${BASE_API_URL}/api/auth/refresh-token`, null, {
        withCredentials: true,
      })
      .then((res) => {
        const { accessToken } = res.data;
        // If an access token is returned, save it to memory
        if (accessToken) {
          setAccessToken(accessToken);
        }
        // Otherwise, do nothing, current user is not authenticated
      })
      .catch((err) => {
        // Handle errors
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">home</Link>
            </li>
            <li>
              <Link to={"/protected"}>protected </Link>
            </li>
            <li>
              <Link to={"/signup"}>sign up </Link>
            </li>
            <li>
              <Link to={"/login"}>log in </Link>
            </li>
            <li>
              <Link to={"/logout"}>log out </Link>
            </li>
          </ul>
        </div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/logout" component={Logout} />
          <Route path="/protected" component={Protected} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
