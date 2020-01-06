import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProductSearch extends Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = { products: [] };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    fetch("/api/search?q=rolex", { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((context) => {
          this.setState({
            products: context.results,
          });


      })
      .catch(error => console.log(error)); // eslint-disable-line no-console
  }

  render() {
    // Render each posts
    return (
      <div>
        <p> RESULTS </p>
        {this.state.products.map(product => (
          <div>
            <div>{product.price}</div>
            <div>{product.product_desc}</div>
          </div>
        ))}
      </div>
    );
  }
}

ProductSearch.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ProductSearch;
