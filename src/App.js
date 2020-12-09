import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import GoogleLogin from "react-google-login";

import { useState, useContext } from "react";
import AuthApi from "./authApi";
import Cookies from "js-cookie";

function App() {
  const [auth, setauth] = useState(false);
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [url, seturl] = useState();

  const readcookie = () => {
    const user = Cookies.get("user");
    if (user) {
      setauth(true);
    }
  };
  React.useEffect(() => {
    readcookie();
  }, []);
  return (
    <div className="App">
      <AuthApi.Provider
        value={{ auth, setauth, name, setname, email, setemail, url, seturl }}
      >
        <Router>
          <Routes />
        </Router>
      </AuthApi.Provider>
    </div>
  );
}
const Login = () => {
  const auth = React.useContext(AuthApi);
  const responseGoogle = (response) => {
    console.log(response);
    auth.setname(response.profileObj.name);
    auth.setemail(response.profileObj.email);
    auth.seturl(response.profileObj.imageUrl);
  };

  const handlChange = () => {
    auth.setauth(true);
    Cookies.set("user", "loginTrue");
  };
  return (
    <div className="App">
      <h1>Welcome to web coding</h1>
      <br />
      <h4>login to see dashboard</h4>
      <input type="email" placeholder="email" />
      <input type="password" placeholder="password" />
      <a href="#" onClick={handlChange}>
        <button onClick={handlChange}>login</button>
        <GoogleLogin
          clientId="262546170129-9u77peh1eogvleqc4kjl79p1b8h3shlr.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          isSignedIn={true}
        />
      </a>
    </div>
  );
};

const Routes = () => {
  const Auth = React.useContext(AuthApi);
  return (
    <Switch>
      <PrivateLogin path="/Login" component={Login} auth={Auth.auth} />
      <PrivateRoute path="/Dashboard" auth={Auth.auth} component={Dashboard} />
    </Switch>
  );
};

const Dashboard = () => {
  const auth = React.useContext(AuthApi);
  const handleChange = () => {
    auth.setauth(false);
    Cookies.remove("user");
  };

  return (
    <>
      <h2>welcome to dashboard</h2>
      <h1>Welcome {auth.name}</h1>
      <p> Email: {auth.email}</p>
      <img src={auth.url} alt="image1" />
      <br />
      <button onClick={handleChange}>logout</button>
    </>
  );
};
const PrivateLogin = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !auth ? <Component /> : <Redirect to={{ pathname: "/dashboard" }} />
      }
    />
  );
};
const PrivateRoute = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? <Component /> : <Redirect to={{ pathname: "/login" }} />
      }
    />
  );
};

export default App;
