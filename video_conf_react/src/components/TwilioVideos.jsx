import React, { Component } from "react";
import TwilioVideo from "twilio-video";

import { IconButton, Badge, Input, Button } from "@material-ui/core";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import CallEndIcon from "@material-ui/icons/CallEnd";
import ChatIcon from "@material-ui/icons/Chat";

//import { message } from 'antd'
import "antd/dist/antd.css";

import { Row } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.css";
import "./video.css";

var elms = 0;
var classRef = null;

class TwilioVideos extends Component {
  constructor(props) {
    super(props);

    this.localVideo = React.createRef();
    this.remoteVideo = React.createRef();
    this.token = props.token;
    this.room = props.room;
    this.uname = props.name;
    classRef = this;
    this.state = {
      video: true,
      audio: true,
      screen: false,
      showModal: false,
      screenAvailable: false,
      messages: [],
      message: "",
      newmessages: 0,
      askForUsername: true,
      roomObj: null,
      //username: faker.internet.userName(),
    };
  }
  appendNewParticipants = (track, identity) => {
    console.log("Append New Participant Called");
    if (document.getElementById(identity) != null)
      document.getElementById(identity).remove();
    const win = document.createElement("div");
    win.setAttribute("id", identity);
    win.appendChild(track.attach());
    this.remoteVideo.current.appendChild(win);
  };

  handleAudio = () => {
    if (!this.state.audio) {
      this.state.roomObj.localParticipant.audioTracks.forEach((publication) => {
        publication.track.enable();
      });
    } else {
      this.state.roomObj.localParticipant.audioTracks.forEach((publication) => {
        publication.track.disable();
      });
    }
    this.setState({ audio: !this.state.audio });
  };
  handleVideo = () => {
    if (this.state.video) {
      this.state.roomObj.localParticipant.videoTracks.forEach((publication) => {
        publication.track.stop();
        publication.unpublish();
        /*const elem = document.getElementById(participant.identity);
                elem.parentNode.removeChild(elem);*/
        console.log("Video stopped!")
      });
    } else {
      const { createLocalVideoTrack } = require("twilio-video");
      createLocalVideoTrack()
        .then((localVideoTrack) => {
          return this.state.roomObj.localParticipant.publishTrack(
            localVideoTrack
          );
        })
        .then((publication) => {
          console.log("Successfully unmuted your video:", publication);
        });
      console.log("new video created!");
    }
    this.setState({ video: !this.state.video });
  };
  handleMessage = () => { };
  handleEndCall = () => {
  
  this.state.roomObj.disconnect();
  window.location.reload();
  };
  handleScreen = () => { };

  changeCssVideos = (main) => {
    let widthMain = main.offsetWidth;
    let minWidth = "30%";
    if ((widthMain * 30) / 100 < 300) {
      minWidth = "300px";
    }
    let minHeight = "40%";

    let height = String(100 / elms) + "%";
    let width = "";
    if (elms === 0 || elms === 1) {
      width = "100%";
      height = "100%";
    } else if (elms === 2) {
      width = "45%";
      height = "100%";
    } else if (elms === 3 || elms === 4) {
      width = "35%";
      height = "50%";
    } else {
      width = String(100 / elms) + "%";
    }

    let videos = main.querySelectorAll("video");
    for (let a = 0; a < videos.length; ++a) {
      videos[a].style.minWidth = minWidth;
      videos[a].style.minHeight = minHeight;
      videos[a].style.setProperty("width", width);
      videos[a].style.setProperty("height", height);
    }

    return { minWidth, minHeight, width, height };
  };

  connect = () => {
    TwilioVideo.connect(this.token, {
      video: true,
      audio: true,
      name: this.room,
    })
      .then((room) => {
        this.setState({ roomObj: room });

        TwilioVideo.createLocalVideoTrack().then((track) => {
          //let main = document.getElementById('my-video');
          //classRef.changeCssVideos(main);
          this.localVideo.current.appendChild(track.attach());
        });
        function removeParticipant(participant) {
          const elem = document.getElementById(participant.identity);
          elem.parentNode.removeChild(elem);
          elms--;
          //let main = document.getElementById('my-video');
          //classRef.changeCssVideos(main);
        }
        function addParticipant(participant) {
          console.log("Added New Participants ");
          elms++;
          //let main = document.getElementById('my-video');
          //classRef.changeCssVideos(main);
          participant.tracks.forEach((publication) => {
            if (publication.isSubscribed) {
              const track = publication.track;
              classRef.appendNewParticipants(track, participant.identity);
              console.log("New Participant Added");
            }
          });
          participant.on("trackSubscribed", (track) => {
            classRef.appendNewParticipants(track, participant.identity);
          });
        }
        room.participants.forEach(addParticipant);
        room.on("participantConnected", addParticipant);
        room.on("participantDisconnected", removeParticipant);
      })
      .catch((e) => console.log(e));
    return () => { };
  };
  componentDidMount() {
    this.connect();
  }

  render() {
    return (
      <div>
        <div
          className="btn-down"
          style={{
            backgroundColor: "whitesmoke",
            color: "whitesmoke",
            textAlign: "center",
          }}
        >
          <IconButton style={{ color: "#424242" }} onClick={this.handleVideo}>
            {this.state.video === true ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>

          <IconButton style={{ color: "#f44336" }} onClick={this.handleEndCall}>
            <CallEndIcon />
          </IconButton>

          <IconButton style={{ color: "#424242" }} onClick={this.handleAudio}>
            {this.state.audio === true ? <MicIcon /> : <MicOffIcon />}
          </IconButton>

          {this.state.screenAvailable === true ? (
            <IconButton
              style={{ color: "#424242" }}
              onClick={this.handleScreen}
            >
              {this.state.screen === true ? (
                <ScreenShareIcon />
              ) : (
                  <StopScreenShareIcon />
                )}
            </IconButton>
          ) : null}

          <Badge
            badgeContent={this.state.newmessages}
            max={999}
            color="secondary"
            onClick={this.openChat}
          >
            <IconButton style={{ color: "#424242" }} onClick={this.openChat}>
              <ChatIcon />
            </IconButton>
          </Badge>
        </div>

        <Modal
          show={this.state.showModal}
          onHide={this.closeChat}
          style={{ zIndex: "999999" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Chat Room</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              overflow: "auto",
              overflowY: "auto",
              height: "400px",
              textAlign: "left",
            }}
          >
            {this.state.messages.length > 0 ? (
              this.state.messages.map((item, index) => (
                <div key={index} style={{ textAlign: "left" }}>
                  <p style={{ wordBreak: "break-all" }}>
                    <b>{item.sender}</b>: {item.data}
                  </p>
                </div>
              ))
            ) : (
                <p>No message yet</p>
              )}
          </Modal.Body>
          <Modal.Footer className="div-send-msg">
            <Input
              placeholder="Message"
              value={this.state.message}
              onChange={(e) => this.handleMessage(e)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={this.sendMessage}
            >
              Send
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="container">
          <div style={{ paddingTop: "20px" }}>
            <Input value={window.location.href} disable="true"></Input>
            <Button
              style={{
                backgroundColor: "#3f51b5",
                color: "whitesmoke",
                marginLeft: "20px",
                marginTop: "10px",
                width: "120px",
                fontSize: "10px",
              }}
              onClick={this.copyUrl}
            >
              Copy invite link
            </Button>
          </div>

          <Row
            id="main"
            className="flex-container"
            style={{ margin: 0, padding: 0 }}
          >
            <div id="my-video-" ref={this.localVideo}></div>
            <div id="my-video-" ref={this.remoteVideo}></div>
          </Row>
        </div>
      </div>
    );
  }
}

export default TwilioVideos;
