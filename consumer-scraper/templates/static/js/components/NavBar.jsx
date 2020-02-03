import React, { Component } from 'react';

class NavBar extends Component {
  render(){
    return(
      <div class="topnav">
        <a href='/'>Home</a>
        <a href='/popular_products'>Popular Products</a>
      </div>
    )
  }
}

export default NavBar;
