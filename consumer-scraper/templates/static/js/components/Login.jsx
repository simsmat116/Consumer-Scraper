import React, { Component } from 'react';
import Popup from "reactjs-popup";

class Login extends Component {
  constructor(props){
    super(props);
    this.state = { username: "", password: ""};
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSignOn = this.handleSignOn.bind(this);
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

  handleSignOn(){
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
          this.props.success();
        }
        else{

        }
      })

  }

  render(){
    return(
      <Popup trigger={<div className="login"> Login </div>} modal>
        <label class="loginLabel">Username</label>
        <input type="text" class="loginField" onChange={this.handleUserChange} />
        <label class="loginLabel">Password</label>
        <input type="password" class="loginField" onChange={this.handlePasswordChange} />
        <input type="submit" class="loginSubmit" onClick={this.handleSignOn} />
      </Popup>
    )
  }
}

export default Login;
