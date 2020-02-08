import React, { Component } from 'react';

class LoginPopup extends Component{
  render(){
    return(
      <div class="login">
        <form class="loginForm">
          <label class="loginLabel">Username</label>
          <input type="text" class="loginField">
          <label class="loginLabel">Password</label>
          <input type="password" class="loginField">
          <input type="submit" class="loginSubmit">
        </form>
      </div>
    )
  }
}
