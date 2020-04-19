import React, { Component } from 'react';

class PageNav extends Component {
  render(){
    let currPage = this.props.currPage;
    let numPages = this.props.numPages;
    // Array for storing the page buttons in the correct order
    let prevClass= "page-item", nextClass = "page-item";
    let pages = []

    if(currPage == 1){
      prevClass = "page-item disabled";
      for(let i = currPage; i <= Math.min(3, numPages); ++i)
        pages.push(i);
    }
    else if(currPage == numPages){
      nextClass = "page-item disabled";
       for(let i = 0; i < Math.min(3, numPages); ++i)
       pages.unshift(currPage - i)
    }
    else{
      pages = [currPage - 1, currPage, currPage + 1]
    }

    return(
      <nav class="page-bar" aria-label="...">
        <ul class="pagination">
          <li class={prevClass}>
            <a class="page-link" onClick={this.props.prevPage}>Previous</a>
          </li>
          {pages.map(page => {
            if(page == currPage)
              return <li class="page-item active">
                <a class="page-link" onClick={this.props.newPage}>{page}</a>
              </li>
            return <li class="page-item">
              <a class="page-link" onClick={this.props.newPage}>{page}</a>
            </li>
          }
          )}
          <li class={nextClass}>
            <a class="page-link" onClick={this.props.nextPage}>Next</a>
          </li>
        </ul>
      </nav>
    )
  }
}

export default PageNav;
