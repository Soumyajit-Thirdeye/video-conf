import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from "../../constants/apiConstants";
import Signin from "../Signin";
import TwilioVideos from "../TwilioVideos";

function Header(props) {
    const [token, setToken] = useState();
    const [name, setName] = useState("");
    const [room, setRoom] = useState("room");
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  let title = capitalize(
    props.location.pathname.substring(1, props.location.pathname.length)
  );
  if (props.location.pathname === "/") {
    title = "Welcome";
  }
  function renderLogout() {
    if (props.location.pathname === "/home") {
      return (
        <div className="ml-auto">
          <button className="btn btn-danger" onClick={() => handleLogout()}>
            Logout
          </button>
          <div className="App">
       {!token ? (
        <div>
        <Header />
        <Signin
          setToken={setToken}
          setName={setName}
          name={name}
          setRoom={setRoom}
          room={room}
        />
        </div>
      ) : (
        <TwilioVideos token={token} room={room} />
      )}
    </div>
        </div>
      );
    }
  }
  function handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
    props.history.push("/login");
  }
  return (
    <nav className="navbar navbar-dark bg-primary">
      <div className="row col-12 d-flex justify-content-center text-white">
        <span className="h3">{props.title || title}</span>
        {renderLogout()}
      </div>
    </nav>
  );
}
export default withRouter(Header);
