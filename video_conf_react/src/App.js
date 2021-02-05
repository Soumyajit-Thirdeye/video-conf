// import { useState } from "react";
// import "./App.css";
// import Signin from "./components/Signin";
// import Header from "./components/Header/Header"
// import TwilioVideos from "./components/TwilioVideo";

// function App() {
//   const [token, setToken] = useState();
//   const [name, setName] = useState("");
//   const [room, setRoom] = useState("room");
//   return (
//     <div className="App">
//       {!token ? (
//         <div>
//         <Header />
//         <Signin
//           setToken={setToken}
//           setName={setName}
//           name={name}
//           setRoom={setRoom}
//           room={room}
//         />
//         </div>
//       ) : (
//         <TwilioVideos token={token} room={room} />
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import LoginForm from "./components/LoginForm/LoginForm";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import Home from "./components/Home/Home";
import Signin from "./components/Signin"
import TwilioVideos from "./components/TwilioVideos";
import PrivateRoute from "./utils/PrivateRoute";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AlertComponent from "./components/AlertComponent/AlertComponent";
function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  const [token, setToken] = useState();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  return (
    <Router>
      <div className="App">
        <Header title={title} />
        <div className="container d-flex align-items-center flex-column">
          <Switch>
            <Route path="/" exact={true}>
              <RegistrationForm
                showError={updateErrorMessage}
                updateTitle={updateTitle}
              />
            </Route>
            <Route path="/register">
              <RegistrationForm
                showError={updateErrorMessage}
                updateTitle={updateTitle}
              />
            </Route>
            <Route exact path="/room">
              <div className="container mt-2">
                {!token ? (
                  <Signin
                    setToken={setToken}
                    setName={setName}
                    name={name}
                    setRoom={setRoom}
                    room={room}
                  />
                ) : (
                  <TwilioVideos token={token} room={room} name={name} />
                )}
              </div>
            </Route>
            <Route path="/login">
              <LoginForm
                showError={updateErrorMessage}
                updateTitle={updateTitle}
              />
            </Route>
            <PrivateRoute path="/home">
              <Home />
            </PrivateRoute>
          </Switch>
          <AlertComponent
            errorMessage={errorMessage}
            hideError={updateErrorMessage}
          />
        </div>
      </div>
    </Router>
  );
}

export default App;