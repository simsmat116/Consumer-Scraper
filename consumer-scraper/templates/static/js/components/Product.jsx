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
      <div class="row">
          <div class="col-md-8 col-md-offset-2">
            <div class="product">
                <p class="product-content"><b>Product Name:</b> </p>
                <p class="product-content">{this.props.productName}</p>
                <p class="product-price"><b>Price:</b> {this.props.price}</p>
                <a product_id={this.props.productID} href={this.props.productLink}
                onClick={this.handleLinkClick} class="product-link" target="_blank">
                  View Product
                </a>
            </div>
          </div>
      </div>
    )
  }

}

export default Product;
