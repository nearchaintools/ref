import * as React from "react";
import { Route } from "react-router-dom";
import { About, Links, ChangeLog, System, Admin } from "./pages";
import { AccountStatus } from "./pages/accounts";

export default [
  <Route exact path="/admin" render={() => <Admin />} />,
  <Route exact path="/about" render={() => <About />} />,
  <Route exact path="/links" render={() => <Links />} />,
  // <Route exact path="/system" render={() => <System />} />,
  <Route exact path="/accounts/status" render={() => <AccountStatus />} />,
];
