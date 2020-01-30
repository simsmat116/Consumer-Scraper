import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Product extends Component {
  render(){
    return(
      <div class="product">
        <p><b>Product Name:</b> {this.props.productName}</p>
        <p><b>Price:</b> {this.props.price}</p>
        <a product_id={this.props.productID} href={this.props.productLink} class="productLink" target="_blank">Product Link</a>
      </div>
    )
  }

}

export default Product;
