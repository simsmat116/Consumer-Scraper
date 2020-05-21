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
        <div class="col-md-6 offset-md-3">
          <div class="product">
            <div class="row">
              <div class="col-md-4 left-product-box">
                <img class="product-image" src={this.props.productIMG} / >
              </div>
              <div class="col-md-8 right-product-box">
                <p><b>{this.props.productName}</b></p>
                <p class="product-desc"><b>Description: </b>{this.props.productDesc}</p>
                <p><b>Price:</b> {this.props.price}</p>
                <a product_id={this.props.productID} href={this.props.productLink} onClick={this.handleLinkClick} class="btn btn-primary" target="_blank">
                    View Product
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Product;
