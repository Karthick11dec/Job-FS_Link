import React, { Fragment } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Common/Home";
import Login from "./components/Common/Login";
import Register from "./components/Common/Register";
import Reset from "./components/Common/Reset";
import Recruiter from "./components/Recruiter/Recruiter";
import Candidate from './components/Candidate/Candidate';
import Job from "./components/Candidate/Job";
import Apply from "./components/Candidate/Apply";


function App() {

  const token = localStorage.getItem("token");

  return (
    <Fragment>
      <BrowserRouter>
        <Switch>
          {token === null && <Route path='/' exact={true}>
            <Home />
          </Route>}
          <Route path='/register/:param' exact={true}>
            <Register />
          </Route>
          <Route path='/login' exact={true}>
            <Login />
          </Route>
          <Route path='/reset' exact={true}>
            <Reset />
          </Route>
          <Route path='/recruiter' exact={true}>
            <Recruiter />
          </Route>
          <Route path='/candidate' exact={true}>
            <Candidate />
          </Route>
          <Route path='/:id' exact={true}>
            <Job />
          </Route>
          <Route path='/:id/:apply' exact={true}>
            <Apply />
          </Route>
        </Switch>
      </BrowserRouter>
    </Fragment>
  )
}

export default App
