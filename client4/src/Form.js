import React from "react";
import TextField from "@material-ui/core/TextField";

export default class Form extends React.Component {
  state = { text: "" };

  handleChange = e => {
    const newText = e.target.value;
    this.setState({ text: newText });
  };

  handleKeyDown = e => {
    console.log(e);
    if (e.key === "Enter") {
      this.props.submit(this.state.text);
    }
  };
  render() {
    return (
      <TextField
        label="todo ......"
        margin="normal"
        fullWidth
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        value={this.state.text}
      />
    );
  }
}
