import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import NavBar from "./components/Header/NavBar.jsx";
import HeatMapContainer from "./views/Heatmap/HeatMap.jsx";
import CreateReport from "./views/CreateReport/CreateReport";
import CreateBusinessReview from "./views/CreateBusinessReview/CreateBusinessReview";
import NotFound from "./views/NotFound/NotFound";

const App = () => {
  const [authenticated, setAuthenticated] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/auth/google/check?timestamp=${new Date().getTime()}`)
      .then((res) => {
        setAuthenticated(res.data.authenticated);
      })
      .catch((err) => {
        setAuthenticated(err.response.data.authenticated);
      });
  });

  return (
    <BrowserRouter>
      <NavBar authenticated={authenticated}></NavBar>
      <Switch>
        <Route exact path="/" component={HeatMapContainer}></Route>
        <Route exact path="/report">
          {authenticated ? <CreateReport/> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/review">
          {authenticated ? <CreateBusinessReview/> : <Redirect to="/login" />}
        </Route>
        <Route
          exact
          path="/login"
          render={() => (window.location = "/api/auth/google")}
        />
        <Route
          exact
          path="/logout"
          render={() => (window.location = "/api/auth/google/logout")}
        />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
