import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import Authorizer from "./components/authorizer";
import Index from "./pages/index";
import Login from "./pages/login";
import Logout from "./pages/logout";
import Register from "./pages/register";

const AllNotesPage = props => <Index {...props} notesType="all" />;
const RecycledNotesPage = props => <Index {...props} notesType="recycled" />;
const RedirectedIndex = () => <Redirect to="/login" />;

const AppRouter = () => {
  return (
    <Router>
      <Authorizer>
        <Route path="/login" exact component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/register" component={Register} />
        <Route path="/notes/recyclebin" component={RecycledNotesPage} />
        <Route path="/notes" component={AllNotesPage} />
        <Route path="/" exact component={RedirectedIndex} />
      </Authorizer>
    </Router>
  );
};

export default AppRouter;
