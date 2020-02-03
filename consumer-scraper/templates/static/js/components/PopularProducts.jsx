import React, { Component } from 'react';
import Product from './Product'
import NavBar from './NavBar'

class PopularProducts extends Component{
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = { products: [] }
  }

  componentDidMount(){
    fetch("/api/popular_products/", { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((context) => {
        this.setState({
          products: context.results
      });
    })
    .catch(error => console.log(error)); // eslint-disable-line no-console
  }

  render(){
    return(
      <div>
        <NavBar />
        <div style={{textAlign:'center'}}>
            {this.state.products.map(product => (
              <Product
              productName={product.product_name}
              productLink={product.product_link}
              productID={product.product_id}
              price={product.price}
              />
            ))}
        </div>
      </div>
    )
  }
}

export default PopularProducts;
