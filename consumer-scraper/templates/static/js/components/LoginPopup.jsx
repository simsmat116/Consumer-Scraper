import React, { Component } from 'react';
import Popup from "reactjs-popup";
import Login from "./Login";
import AccountCreation from "./Creation"

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

    // Determine which form to display
    let form = this.state.isLoggingIn ? <Login success={this.props.success} /> : <AccountCreation success={this.props.success} />;

    // Determine what the classes for 'Login' and 'Account Creation' to determine how they are displayed
    let loginClass = this.state.isLoggingIn ? "top-bar-curr" : "top-bar-click";
    let creationClass = this.state.isLoggingIn ?  "top-bar-click" : "top-bar-curr";

    return(
      <Popup trigger={<div className="login"> Login </div>} onClose={this.handleClose} modal>
        <div class={loginClass} onClick={this.handleLoginSwitch}>Login</div>
        <div class={creationClass} onClick={this.handleLoginSwitch}>Account Creation</div>
        {form}
      </Popup>
    )
  }
}

export default LoginPopup;
