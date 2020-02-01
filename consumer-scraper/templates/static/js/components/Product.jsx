import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Product extends Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick(e){
    // Send a POST request to update number of visits to product
    let productID = e.target.getAttribute('product_id');
    fetch('/api/popular_products/' + productID, {
        method: 'POST',
        credentintials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      });
  }

  render(){
    return(
      <div class="product">
        <p><b>Product Name:</b> </p>
        <p class="productName">{this.props.productName}</p>
        <p><b>Price:</b></p>
        <p> {this.props.price}</p>
        <a product_id={this.props.productID} href={this.props.productLink}
           onClick={this.handleLinkClick} class="productLink" target="_blank">
           View Product
        </a>
      </div>
    )
  }

}

export default Product;
