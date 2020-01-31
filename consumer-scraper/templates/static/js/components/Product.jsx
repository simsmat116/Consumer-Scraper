import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Product extends Component {
  render(){
    return(
      <div class="product">
        <p><b>Product Name:</b> </p>
        <p class="productName">{this.props.productName}</p>
        <p><b>Price:</b></p>
        <p> {this.props.price}</p>
        <a product_id={this.props.productID} href={this.props.productLink} class="productLink" target="_blank">View Product</a>
      </div>
    )
  }

}

export default Product;
