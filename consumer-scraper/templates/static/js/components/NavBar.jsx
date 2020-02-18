import React, { Component } from 'react';
import Popup from "reactjs-popup";
import LoginPopup from "./LoginPopup";

class NavBar extends Component {
  constructor(props){
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
  }

  handleLogout(){
    localStorage.removeItem('username');
    this.forceUpdate();
  }

  handleLoginSuccess(){
    this.forceUpdate();
  }

  render(){
    // Determine if a user is logged in
    let topRight;
    if(!localStorage.getItem('username')){
      topRight = <LoginPopup success={this.handleLoginSuccess} />
    }
    else{
      topRight = (
                    <div class="login">{localStorage.getItem('username')}
                      <div class="loginDropMenu">
                        <div>Your profile</div>
                        <div>Your message</div>
                        <div onClick={this.handleLogout}>Logout</div>
                      </div>
                    </div>
                 );
    }

    return(
      <div class="topnav">
        <a href='/'>Home</a>
        <a href='/popular_products'>Popular Products</a>
        {topRight}
      </div>
    )
  }
}

export default NavBar;
