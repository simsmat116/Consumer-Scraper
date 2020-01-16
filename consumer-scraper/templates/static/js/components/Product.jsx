import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Product extends Component {
  render(){
    return(
      <div class="product">
        <img src={this.props.imageLink} />
        <p><b>Product Name:</b> {this.props.productName}</p>
        <p><b>Description:</b> {this.props.productDesc}</p>
        <p><b>Price:</b> {this.props.price}</p>
        <a href={this.props.productLink} class="productLink" target="_blank">Product Link</a>
      </div>
    )
  }

}

export default Product;
