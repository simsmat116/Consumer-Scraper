import React, { Component } from 'react';

class AccountCreation extends Component {
  constructor(props){
    super(props);
    this.state = { username: "", password: "", password2: "", errorMsg: ""}
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePassword2Change = this.handlePassword2Change.bind(this);
    this.handleAccountCreation = this.handleAccountCreation.bind(this);
    this.accountCreationCheck = this.accountCreationCheck.bind(this);
  }

  accountCreationCheck(){
    let error = "";
    // Need to make sure that the following checks are completed before sending request
    if(!this.state.username) error = "Error: Please enter a username"
    else if(!this.state.password) error = "Error: Please enter a password."
    else if(!this.state.password2) error = "Error: Please retype your password."
    else if(this.state.password !== this.state.password2) error = "Error: Passwords do not match."

    this.setState({
      errorMsg: error
    });

    return error == "";
  }

  handleUserChange(e){
    this.setState({
      username: e.target.value,
    });
  }

  handlePasswordChange(e){
    this.setState({
      password: e.target.value,
    });
  }

  handlePassword2Change(e){
    this.setState({
      password2: e.target.value,
    });
  }

  handleAccountCreation(){
    // Ensure that all necessary information is correct before sending POST request
    if(!this.accountCreationCheck()){
      return;
    }

    // Send POST request to the backend to create the account
    fetch("/api/accounts/create", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
    })
      .then((response) => {
        if(!response.ok) throw Error(response.statusText)
        return response.json();
      })
      .then((context) => {
        if(context.account_status == "success"){
          localStorage.setItem("username", this.state.username);
          // Call the success function passed from NavBar component to rerender entire page
          this.props.success();

          // Successful login, clear the error message
          this.setState({
            errorMsg: ""
          });
        }
        else{
          // If the request is not a success, an error message is provided
          // This often relates to duplicate accounts
          this.setState({
            errorMsg: context.message
          });
        }
      });
  }

  render(){
    let loginError;
    if(this.state.errorMsg){
      loginError = <div class="loginError">{this.state.errorMsg}</div>
    }

    return(
      <div>
        <label class="loginLabel">Username</label>
        <input type="text" class="loginField" onChange={this.handleUserChange} />
        <label class="loginLabel">Password</label>
        <input type="password" class="loginField" onChange={this.handlePasswordChange} />
        <label class="loginLabel">Re-type Password</label>
        <input type="password" class="loginField" onChange={this.handlePassword2Change} />
        {loginError}
        <input type="submit" class="loginSubmit" onClick={this.handleAccountCreation} />
      </div>
    )
  }

};

export default AccountCreation;
