import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Product from './Product'
import PageNav from './PageNav'
import NavBar from './NavBar'


class ProductSearch extends Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = { products: [], search: "", page: 1, numPages: 0 };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.pageClick = this.pageClick.bind(this);
  }

  fetchPageResults(pageNum){
    // Construct url to be sent to search results API
    const url = "api/search?q=" + this.state.search + "&p=" + String(pageNum);
    // Send a request to the backend to get products for the certain page
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

  handleSearchChange(e){
    this.setState({
      search: e.target.value,
    });
  }

  handleSearch(e){
    e.preventDefault();
    this.fetchPageResults(this.state.page);
  }

  prevPageClick(e){
    e.preventDefault();
    // Set the page to be the previous page
    this.setState({
      page: this.state.page - 1
    });

    this.fetchPageResults(this.state.page);
    window.scrollTo(0, 0)
  }

  pageClick(e){
    e.preventDefault();
    // Get the page that was clicked on
    let newPage = parseInt(e.currentTarget.textContent, 10);
    // Set the new page in the state
    this.setState({
      page: newPage
    });

    this.fetchPageResults(this.state.page);
    window.scrollTo(0,0);
  }

  nextPageClick(e){
    e.preventDefault();
    // Set the page to be the next one
    this.setState({
      page: this.state.page + 1
    });

    this.fetchPageResults(this.state.page);
    window.scrollTo(0, 0)
  }

  render() {
    // Render each posts
    return (
      <div class="search-container">
        <NavBar />
        <div>
          <form>
            <input class="search" type="text" placeholder="What are you shopping for?" onChange={this.handleSearchChange}/>
            <input type="submit" class="searchSubmit" onClick={this.handleSearch} />
            </form>
            {this.state.products.map(product => (
              <Product
              productName={product.product_name}
              productLink={product.product_link}
              productID={product.product_id}
              price={product.price}
              />
            ))}
            <PageNav
            prevPage={this.prevPageClick}
            newPage={this.pageClick}
            nextPage={this.nextPageClick}
            numPages={this.state.numPages}
            currPage={this.state.page}
            />
        </div>
      </div>
    );
  }
}

ProductSearch.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ProductSearch;
