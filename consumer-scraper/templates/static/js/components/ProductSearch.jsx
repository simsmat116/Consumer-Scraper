import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Product from './Product';
import PageNav from './PageNav';
import NavBar from './NavBar';
import * as qs from 'query-string';

class ProductSearch extends Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = { products: [], search: "", page: 1, numPages: 0, productExists: false };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.pageClick = this.pageClick.bind(this);
    this.validPage = this.validPage.bind(this);
    this.postSearchQuery = this.postSearchQuery.bind(this);
    this.fetchPageResults = this.fetchPageResults.bind(this);
    this.submitSearch = this.submitSearch.bind(this);

    let params = qs.parse(this.props.location.search);
    let search = "q" in params
    this.state = { products: [], search: "q" in params ? params["q"] : "", page: 1, numPages: 0, productExists: false };

    if(search){
      this.handleSearch();
    }

  }

  postSearchQuery(){
    // Send a POST request to have backend begin the scraping process
    fetch("api/scrape_products",
      { method: 'POST',
        credentintials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: this.state.search
        })
      })
        .then((response) => {
          // If the POST is unsuccessful, throw an error
          if (!response.ok) throw Error(response.statusText);
          return response.text();
        })
        .then((text) => {
          if(text === "Product Exists"){
            this.setState( { productExists: true })
          }
        })
        .catch(error => console.log(error));
  }

  fetchPageResults(pageNum){
    // Construct url to be sent to search results API
    const url = "api/retrieve_products?q=" + this.state.search + "&p=" + String(pageNum);
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

          this.props.history.push('/search' + '?q=' + this.state.search);
      })
      .catch(error => console.log(error));
  }

  handleSearchChange(e){
    this.setState({
      search: e.target.value,
    });
  }

  handleSearch(){
    this.postSearchQuery();
    // Wait 5 seconds before checking the database
    setTimeout(function(){
      if(this.state.productExists){
        this.fetchPageResults(1);
        this.setState({ productExists: false });
      }
      else{
        setTimeout(function(){ this.fetchPageResults(1); }.bind(this), 6000);
      }
    }.bind(this), 2000);
  }

  submitSearch(e){
    e.preventDefault();
    this.handleSearch();
  }

  validPage(page){
    return page > 0 && page <= this.state.numPages;
  }

  pageClick(e){
    e.preventDefault();
    // Get the page that was clicked on
    let newPage = this.state.page;
    let textContent = e.target.textContent;
    if(textContent === "Previous"){
      newPage -= 1
    }
    else if(textContent === "Next"){
      newPage += 1;
    }
    else{
      newPage = parseInt(textContent, 10);
    }

    if(!this.validPage(newPage)) return;
    // Set the new page in the state
    this.setState({
      page: newPage
    });

    this.fetchPageResults(newPage);
    window.scrollTo(0,0);
  }

  render() {
    // Pagination is not displayed when there are no products to be displayed
    let pageNav;
    if(this.state.products.length){
      pageNav = <PageNav
        newPage={this.pageClick}
        numPages={this.state.numPages}
        currPage={this.state.page}
      />
    }

    // Render each posts
    return (
      <div>
        <NavBar />
        <div>
          <form class="search-container">
            <input class="search" type="text" placeholder="What are you shopping for?" onChange={this.handleSearchChange}/>
            <input type="submit" class="searchSubmit" onClick={this.submitSearch} />
          </form>
            {this.state.products.map(product => (
              <Product
              productName={product.name}
              productDesc={product.description}
              price={product.price}
              productLink={product.link}
              productIMG={product.image_link}
              productID={product.product_id}
              />
            ))}
            {pageNav}
        </div>
      </div>
    );
  }
}

ProductSearch.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ProductSearch;
