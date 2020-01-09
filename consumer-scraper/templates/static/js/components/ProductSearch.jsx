import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Product from './Product'


class ProductSearch extends Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = { products: [], search: "", page: 1 };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(e){
    this.setState({
      search: e.target.value,
    });
  }

  handleSearch(){
    const url = "api/search?q=" + this.state.search + "&p=" + String(this.state.page);
    console.log(url);
    fetch(url, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((context) => {
          this.setState({
            products: context.results,
          });


      })
      .catch(error => console.log(error));
  }

  render() {
    // Render each posts
    return (
      <div style={{textAlign:'center'}}>
        <form>
          <input class="search" type="text" placeholder="What are you shopping for?" onChange={this.handleSearchChange}/>
          <input type="submit" class="search-submit" onClick={this.handleSearch} />
        </form>
        {this.state.products.map(product => (
          <Product price={product.price} productDesc={product.product_desc} />
        ))}
      </div>
    );
  }
}

ProductSearch.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ProductSearch;
