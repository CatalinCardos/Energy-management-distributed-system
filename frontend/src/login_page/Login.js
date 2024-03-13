import "./Login.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState(sessionStorage.getItem("role") || null);
  const [authenticated, setauthenticated] = useState(
    sessionStorage.getItem("authenticated") || false
  );
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  const handlelogin = async () => {
    const data = { username, password };
    await axios
      .post("http://localhost:3002/users/login", data)
      .then((response) => {
        sessionStorage.setItem("authenticated", true);
        sessionStorage.setItem("token", response.data.token);
        setToken(response.data.token);
      })
      .catch((error) => {
        alert(error.response.data.message || "Error!");
        return;
      });
  };

  useEffect(() => {
    if (token === "") {
      return;
    }
    axios
      .get("http://localhost:3002/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        sessionStorage.setItem("role", +response.data.role);
        sessionStorage.setItem("id", response.data.id);
        sessionStorage.setItem("username", response.data.username);
        setauthenticated(true);
        setUserRole(+response.data.role);
      })
      .catch((error) => {
        alert(error.response.data.message || "Error!");
        return;
      });
  }, [token]);

  if (authenticated) {
    if (+userRole === 0) {
      return <Navigate replace to="/admin" />;
    }

    return <Navigate replace to="/home" />;
  } else {
    return (
      <div className="Login">
        <header className="Login-header">
          <p>SIGN IN</p>
        </header>
        <div className="Login-form">
          <div className="Login-inputbox">
            <input
              className="Login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="Login-inputbox">
            <input
              className="Login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>
          <button className="Login-button" type="button" onClick={handlelogin}>
            Sign in
          </button>
          <text>
            Don't have an account? <a href="/register">Sign up</a>
          </text>
        </div>
      </div>
    );
  }
}
