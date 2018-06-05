import React, { Component } from "react";
import "./App.css";
import gql from "graphql-tag";
import { grpahql, graphql, compose } from "react-apollo";
import Paper from "@material-ui/core/Paper";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Form from "./Form";

const TodoQuery = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`;

const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateToDoo(id: $id, complete: $complete)
  }
`;

const RemoveMutation = gql`
  mutation($id: ID!) {
    removeToDoo(id: $id)
  }
`;

const CreateMutation = gql`
  mutation($text: String!) {
    createToDoo(text: $text) {
      id
      text
      complete
    }
  }
`;

class App extends Component {
  updateTodoHandler = async todo => {
    //update todo
    await this.props.updateMyTodo({
      variables: { id: todo.id, complete: !todo.complete },
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: TodoQuery });
        // Add our comment from the mutation to the end.
        data.todos = data.todos.map(
          t => (t.id === todo.id ? { ...todo, complete: !todo.complete } : t)
        );
        // Write our data back to the cache.
        store.writeQuery({ query: TodoQuery, data });
      }
    });
  };

  removeTodoHandler = async todo => {
    //remove todo
    await this.props.removeMyTodo({
      variables: { id: todo.id },
      update: (store, data1) => {
        const data = store.readQuery({ query: TodoQuery });
        console.log("removeTodoHandler", data1);
        data.todos = data.todos.filter(t => t.id !== todo.id);
        store.writeQuery({ query: TodoQuery, data });
      }
    });
  };

  createTodo = async text => {
    //create todo
    await this.props.createMyTodo({
      variables: { text: text },
      update: (store, { data: { createToDoo } }) => {
        const myData = store.readQuery({ query: TodoQuery });
        console.log(createToDoo, "my data", myData);
        //if (createToDoo.__typename) delete createToDoo.__typename;
        myData.todos.unshift(createToDoo);
        store.writeQuery({ query: TodoQuery, myData });
      }
    });
  };

  render() {
    console.log(this.props);
    const {
      data: { loading, todos }
    } = this.props;
    if (loading) return null;

    return (
      <div style={{ display: "flex" }}>
        <div style={{ margin: "auto", width: 400 }}>
          <Form submit={this.createTodo} />
          <Paper elevation={1}>
            <List>
              {todos.map(todo => (
                <ListItem
                  key={todo.id}
                  role={undefined}
                  dense
                  button
                  onClick={() => this.updateTodoHandler(todo)}
                >
                  <Checkbox
                    checked={todo.complete}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={todo.text} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.removeTodoHandler(todo)}>
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(CreateMutation, { name: "createMyTodo" }),
  graphql(UpdateMutation, { name: "updateMyTodo" }),
  graphql(RemoveMutation, { name: "removeMyTodo" }),
  graphql(TodoQuery)
)(App);
