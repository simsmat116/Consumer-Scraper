import React from 'react';
import { HashRouter, Route, hashHistory } from 'react-router-dom';
import ProductSearch from './components/ProductSearch';
import PopularProducts from './components/PopularProducts'
// import more components
export default (
    <HashRouter history={hashHistory}>
     <div>
      <Route path='/' component={ProductSearch} />
      <Route path='/search' component={ProductSearch} />
      <Route path='/popular_products' componenet={PopularProducts} />
     </div>
    </HashRouter>
);
