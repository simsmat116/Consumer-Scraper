import React from 'react';
import { HashRouter, Route, hashHistory } from 'react-router-dom';
import ProductSearch from './components/ProductSearch';
// import more components
export default (
    <HashRouter history={hashHistory}>
     <div>
      <Route path='/' url='api/search' component={ProductSearch} />
      <Route path='/search' url='api/search' component={ProductSearch} />
     </div>
    </HashRouter>
);
