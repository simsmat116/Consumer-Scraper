import React, { Component } from 'react';
import Popup from "reactjs-popup";
import Login from "./Login";

class LoginPopup extends Component {
  constructor(props){
    super(props);
    this.state = { isLoggingIn: true };
    this.handleLoginSwitch = this.handleLoginSwitch.bind(this);
  }

  handleLoginSwitch(e){
    let switchToCreation = e.target.innerText === 'Account Creation' && this.state.isLoggingIn;
    let switchToLogin = e.target.innerText === 'Login' && !this.state.isLoggingIn;

    if(switchToCreation || switchToLogin){
      this.setState({
        isLoggingIn: !this.state.isLoggingIn
      });
    }
  }

  render(){

    // Determine what the classes for 'Login' and 'Account Creation' to determine how they are displayed
    let loginClass = this.state.isLoggingIn ? "top-bar-curr" : "top-bar-click";
    let creationClass = this.state.isLoggingIn ?  "top-bar-click" : "top-bar-curr";

    return(
      <Popup trigger={<div className="login"> Login </div>} onClose={this.handleClose} modal>
        <div class={loginClass} onClick={this.handleLoginSwitch}>Login</div>
        <div class={creationClass} onClick={this.handleLoginSwitch}>Account Creation</div>
        <Login success={this.props.success} />
      </Popup>
    )
  }
}

export default LoginPopup;
