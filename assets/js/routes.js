import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";

import Main from './pages/main';
import Product from './pages/product';
import NoMatch from './pages/nomatch';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/product/:id" component={Product} />
            <Route component={NoMatch} />
        </Switch>
    </BrowserRouter>
);

export default Routes;