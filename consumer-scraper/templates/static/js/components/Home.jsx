import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import NavBar from './NavBar';


class Home extends Component {


  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = { search: "" };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(e){
    this.setState({
      search: e.target.value,
    });
  }

  handleSearch(e){
    this.props.history.push('/search');
  }

  render(){
    return(
      <div>
        <NavBar />
        <div>
          <form class="search-container">
            <input class="search" type="text" placeholder="What are you shopping for?" onChange={this.handleSearchChange}/>
            <input type="submit" class="searchSubmit" onClick={this.handleSearch} />
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(Home);
