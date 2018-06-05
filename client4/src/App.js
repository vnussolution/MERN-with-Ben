import React, { Component } from "react";
import "./App.css";
import gql from "graphql-tag";
import { grpahql } from "react-apollo";

const TodoQuery = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`;

class App extends Component {
  render() {
    return <div className="App">hello</div>;
  }
}

export default App;
