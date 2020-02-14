import React, { Component } from 'react';
import Popup from "reactjs-popup";

class Login extends Component {
  constructor(props){
    super(props);
    this.state = { username: "", password: "", failedLogin: false, isLoggingIn: true };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSignOn = this.handleSignOn.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLoginSwitch = this.handleLoginSwitch.bind(this);
  }

  handleUserChange(e){
    // Update the username entered to use in POST request
    this.setState({
      username: e.target.value,
    });
  }

  handlePasswordChange(e){
    // Update password entered to use in POST request
    this.setState({
      password: e.target.value,
    });
  }

  handleSignOn(){
    // Send POST request to login REST API
    fetch("/api/accounts/login", {
        method: 'POST',
        credentintials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        })
    })
      .then((response) => {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((context) => {
        // The username and password are valid
        if(context.login_status == "success"){
          localStorage.setItem('username', this.state.username);
          // Call the success function passed from NavBar component to rerender entire page
          this.props.success();
          // Login success, so ensure that error text won't be displayed in future
          this.setState({
            failedLogin: false,
          });
        }
        else{
          // Failed login, set field to true so that error text is rendered
          this.setState({
            failedLogin: true,
          });
        }
      })
  }

  handleClose(){
    // When the popup is closed, ensure that error text won't be display when reopened
    this.setState({
      failedLogin: false,
    })
  }

  handleLoginSwitch(e){
    let switchToCreation = e.target.innerText === 'Account Creation' && this.state.isLoggingIn;
    let switchToLogin = e.target.innerText === 'Login' && !this.state.isLoggingIn;

    if(switchToCreation || switchToLogin){
      this.setState({
        isLoggingIn: !this.state.isLoggingIn
      })
    }
  }

  render(){
    let loginError;
    // Determine if error text should be displayed
    if(this.state.failedLogin){
      loginError = <div class="loginError">Error: The entered username or password is incorrect.</div>
    }

    let loginClass = this.state.isLoggingIn ? "top-bar-curr" : "top-bar-click";
    let creationClass = this.state.isLoggingIn ?  "top-bar-click" : "top-bar-curr";

    return(
      <Popup trigger={<div className="login"> Login </div>} onClose={this.handleClose} modal>
        <div class={loginClass} onClick={this.handleLoginSwitch}>Login</div>
        <div class={creationClass} onClick={this.handleLoginSwitch}>Account Creation</div>
        <label class="loginLabel">Username</label>
        <input type="text" class="loginField" onChange={this.handleUserChange} />
        <label class="loginLabel">Password</label>
        <input type="password" class="loginField" onChange={this.handlePasswordChange} />
        {loginError}
        <input type="submit" class="loginSubmit" onClick={this.handleSignOn} />
      </Popup>
    )
  }
}

export default Login;
