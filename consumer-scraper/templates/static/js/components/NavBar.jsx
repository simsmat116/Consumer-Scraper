import React, { Component } from 'react';
import Popup from "reactjs-popup";

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
    if(localStorage.getItem('username')){
      topRight = (
        <ul class="navbar-nav navbar-right">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Username <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
              <li><a href="#">Profile</a></li>
              <li><a href="#">Messages</a></li>
              <li><a href="#">Settings</a></li>
              <li><a href="#">Logout</a></li>
            </ul>
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
      </nav>
    )
  }
}

export default NavBar;
