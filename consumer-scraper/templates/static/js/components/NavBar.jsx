import React, { Component } from 'react';
import Popup from "reactjs-popup";

class NavBar extends Component {
  render(){
    return(
      <div class="topnav">
        <a href='/'>Home</a>
        <a href='/popular_products'>Popular Products</a>
        <Popup trigger={<div className="login"> Login </div>} modal>
          <label class="loginLabel">Username</label>
          <input type="text" class="loginField" />
          <label class="loginLabel">Password</label>
          <input type="password" class="loginField" />
          <input type="submit" class="loginSubmit"/ >
        </Popup>
      </div>
    )
  }
}

export default NavBar;
