import React from "react";
import { Switch, Route } from "react-router-dom";
import InSteps from "./components/LinearProgramation/InSteps";
import LinearProgramation from './components/LinearProgramation'
import Inicio from "./components/Inicio";
import Evaluate from "./components/Evaluate";
import SinglePage from "./components/LinearProgramation/SinglePage";

const Index = () => <Inicio/>;

const App = () => 
    <Switch>
      <Route exact path="/" component={Index} />
      <Route exact path="/Evaluete" component={Evaluate} />
      <Route exact path="/LinearProgramation" component={LinearProgramation} />
      <Route exact path="/LinearProgramation/InSteps" component={InSteps} />
      <Route exact path="/LinearProgramation/SinglePage" component={SinglePage} />
    </Switch>;

export default App;
