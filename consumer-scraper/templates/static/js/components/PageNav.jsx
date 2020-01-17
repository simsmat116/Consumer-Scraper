import React, { Component } from 'react';

class PageNav extends Component {
  render(){
    let currPage = this.props.currPage;
    let numPages = this.props.numPages;
    let maxPage = Math.min(numPages, currPage + 5);

    let pages = []
    // If the first page isn't displayed, give user a button to click to go back
    if(currPage != 1){
      pages.push(<button class="page" onClick={this.props.onClicked}>1</button>);
      pages.push(<div class="pageDots">...</div>);
    }

    // Add buttons for the next five pages
    for(let i = currPage; i <= maxPage; ++i){
      pages.push(<button class="page" onClick={this.props.onClicked}>{i}</button>);
    }

    // If the last page isn't displayed, give user a button to click to go to end
    if(numPages - currPage > 4){
      pages.push(<div class="pageDots">...</div>);
      pages.push(<button class="page" onClick={this.props.onClicked}>numPages</button>);
    }

    return(
      <div class="page-bar">
        {pages}
      </div>

    )
  }
}

export default PageNav;
