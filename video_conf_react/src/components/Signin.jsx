import React from "react";
import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../constants/apiConstants";
import { useHistory } from "react-router-dom";

function Signin({ setToken, setName, setRoom, name, room }) {
  const history = useHistory();
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
    redirectToCustomRoom(room);
  }
  const createRoom = async event => {
    event.preventDefault();
    const email = localStorage.getItem("email");
    const payload = { email: email };
    const response = await axios.post(
      API_BASE_URL + "/user/getRoomId",
      payload
    );
    // console.log(response);
    var fetchedRoom = response.data.roomId;
    var fetchedName = response.data.name
    console.log(room);

    const result = await axios.post(
      "https://video-conf-8400-dev.twil.io/video-token",
      {
        identity: fetchedName,
        fetchedRoom,
      }
    );
    setToken(result.data);
    redirectToCustomRoom(fetchedRoom);
    console.log("Token Received is", result.data);
  }

  const redirectToCustomRoom = (roomId) => {
    history.push({
      pathname: '/room',
      search: "?" + new URLSearchParams({roomId: roomId}).toString()
    })
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
      <fieldset>
        <form onSubmit={createRoom}>
          <button type="submit">Create Room</button>
        </form>
      </fieldset>
    </div>
  );
}
export default Signin;