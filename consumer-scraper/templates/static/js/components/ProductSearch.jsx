import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Product from './Product'
import PageNav from './PageNav'


class ProductSearch extends Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = { products: [], search: "", page: 1, numPages: 0 };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.pageClick = this.pageClick.bind(this);
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
            numPages: context.num_pages
          });
      })
      .catch(error => console.log(error));
  }

  pageClick(e){
    let newPage = parseInt(e.currentTarget.textContent, 10)
    // Set the page to be the page that the user clicked on
    this.setState({
      page: newPage
    });
    // Send a request to the backend to get products for the certain page
    const url = "api/search?q=" + this.state.search + "&p=" + String(e.currentTarget.textContent);
    console.log(url);
    fetch(url, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((context) => {
          this.setState({
            products: context.results,
            numPages: context.num_pages
          });
      })
      .catch(error => console.log(error));
      window.scrollTo(0, 0)
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
        <PageNav onClicked={this.pageClick} numPages={this.state.numPages} currPage={this.state.page} />
      </div>
    );
  }
}

ProductSearch.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ProductSearch;
