import React, { useEffect, useState } from "react";
import Video from "twilio-video";
import Participant from "./Participant";

const Room = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [toggleAudio, setToggleAudio] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(true);
  const [toggleParticipantsList, setParticipantsList] = useState(true)

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    
    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
    });
    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(function(
            trackPublication
          ) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName,token]);

  const handleCallDisconnect = () => {
    room.disconnect();
  };

  const handleAudioToggle = () => {
    room.localParticipant.audioTracks.forEach(track => {
      if (track.track.isEnabled) {
        track.track.disable();
      } else {
        track.track.enable();
      }
      setToggleAudio(track.track.isEnabled);
    });
  };

  const handleParticipantsListToggle = () => {
    setParticipantsList(!toggleParticipantsList)
    console.log(allAttendees)
  }

  const handleVideoToggle = () => {
    console.log(room.localParticipant.videoTracks);
    room.localParticipant.videoTracks.forEach(track => {
      if (toggleVideo) {
        //room.localParticipant.unpublishTrack(track.track);
        track.track.stop();
        //track.unpublish();
      } else {
      const { createLocalVideoTrack } = require('twilio-video');

      createLocalVideoTrack().then(localVideoTrack => {
        room.localParticipant.unpublishTrack(track.track);
        return room.localParticipant.publishTrack(localVideoTrack);
      }).then(publication => {
        console.log('Successfully unmuted your video:', publication.track);
        publication.track.attach(document.getElementById("localVideo"));
      });
      }
    });
    setToggleVideo(!toggleVideo);
  };

  const remoteParticipants = participants.map((participant) => (
    <Participant
      key={participant.sid}
      participant={participant}
      isLocal={false}
    />
  ));

  const allAttendees = participants.map((participant) => {
      return participant.identity;
    });

  return (
    <div className="room">
      {!toggleParticipantsList ? <div>
      <h2>Room: {roomName}</h2>
      <p> Total Participants: {allAttendees.length + 1}</p>
      <p>All attendees: {room.localParticipant.identity}(you) {allAttendees}</p>
      </div> : ""}
      {/* <button onClick={handleLogout}>Log out</button> */}
      <div className="local-participant">
        {room ? (
          <div>
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              handleAudioToggle={handleAudioToggle}
              handleVideoToggle={handleVideoToggle}
              handleCallDisconnect={handleCallDisconnect}
              handleParticipantsListToggle={handleParticipantsListToggle}
              toggleAudio={toggleAudio}
              toggleVideo={toggleVideo}
              toggleParticipantsList={toggleParticipantsList}
              isLocal={true}
              handleLogout={handleLogout}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;
