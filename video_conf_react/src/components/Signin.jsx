import React from "react";
import axios from "axios";

function Signin({ setToken, setName, setRoom, name, room }) {
  async function doSubmit(event) {
    event.preventDefault();
    const result = await axios.post(
      "https://video-conf-8400-dev.twil.io/video-token",
      {
        identity: name,
        room,
      }
    );
    setToken(result.data);
    console.log("Token Received is", result.data);
  }
  return (
    <div style={{ width: "50%" }}>
      <br />
      <br />
      <fieldset>
        <form onSubmit={doSubmit}>
          <label htmlFor="name">
            Name:
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <br />
          <br />
          <label htmlFor="room">
            Room:
            <input
              type="text"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </label>
          <br />
          <br />
          <button type="submit">Join Room</button>
        </form>
      </fieldset>
    </div>
  );
}
export default Signin;