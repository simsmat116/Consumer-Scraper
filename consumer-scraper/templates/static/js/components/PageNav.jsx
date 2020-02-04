import React, { Component } from 'react';

class PageNav extends Component {
  render(){
    let currPage = this.props.currPage;
    let numPages = this.props.numPages;
    let overflow = Math.min(numPages - (currPage + 2), 0)
    let underflow = Math.min(currPage - 3, 0)
    let minPage = Math.max(1, currPage - 2 + overflow);
    let maxPage = Math.min(numPages, currPage + 2 - underflow);
    // Array for storing the page buttons in the correct order
    let pages = []

    // Add pages from minPage to maxPage (a total of five pages)
    for(let i = minPage; i <= maxPage; ++i){
      pages.push(<button class="page" onClick={this.props.onClicked}>{i}</button>);
    }

    return(
      <div class="page-bar">
        {pages}
      </div>

    )
  }
}

export default PageNav;
