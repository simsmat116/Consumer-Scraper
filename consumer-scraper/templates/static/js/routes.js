import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import ProductSearch from './components/ProductSearch';
import PopularProducts from './components/PopularProducts'
// import more components
export default (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={ProductSearch} />
      <Route exact path='/search' component={ProductSearch} />
      <Route exact path='/popular_products' component={PopularProducts} />
    </Switch>
  </BrowserRouter>
);
