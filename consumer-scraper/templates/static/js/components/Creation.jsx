import React, { Component } from 'react';

class AccountCreation extends Component {
  constructor(props){
    super(props);
    this.state = { username: "", password: "", password2: "", errorMsg: ""}
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
    })
  }

  handleAccountCreation(){
    alert("HEH");
    if(this.state.password !== this.state.password2){
      this.setState({
        errorMsg: "Passwords do not match."
      })
      return;
    }

    alert('HELLO THERE');

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
          this.setState({
            errorMsg: context.message
          });
        }
      });
  }

  render(){
    let loginError;
    if(this.state.errorMsg){
      loginError = <div class="loginError">{`Error: ${this.state.erroMsg}`}</div>
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
