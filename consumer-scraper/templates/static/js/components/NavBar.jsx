import React, { Component } from 'react';
import Popup from "reactjs-popup";
import cookie from 'react-cookies';
import Login from './Login';

class NavBar extends Component {
  constructor(props){
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(){
    this.forceUpdate();
  }

  render(){
    // Determine if a user is logged in
    let username = cookie.load("username");
    let topRight;
    if(username){
      topRight = (
        <ul class="navbar-nav ml-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {username} <span class="caret"></span>
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Profile</a>
              <a class="dropdown-item" href="#">Messages</a>
              <a class="dropdown-item" href="#">Settings</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Logout</a>
            </div>
          </li>
        </ul>
      )
    }
    else{
      topRight = (
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link" data-toggle="modal" href="#signup-popup">
              <span class="glyphicon glyphicon-log-in"></span> Login
            </a>
          </li>
        </ul>
                 );
    }

    return(
      <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Consumer Scraper</a>
        <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="/popular_products">Popular Products</a></li>
        </ul>
        {topRight}
        <Login handleLogin={this.handleLogin}/>
      </nav>

    )
  }
}

export default NavBar;
