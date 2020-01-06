import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Product extends Component {
  render(){
    return(
      <div class="product">
        <p><b>Description:</b> {this.props.productDesc}</p>
        <p><b>Price:</b> {this.props.price}</p>
        <button class="productLink">Product Link</button>
      </div>
    )
  }

}

export default Product;
