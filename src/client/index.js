import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import 'client/styles/global.scss';
import reducer from 'client/logic/reducer';

import Search from 'client/components/search';
import SearchSummary from 'client/components/search-summary';
import AvailabilityPanel from 'client/components/availability-panel';
import RankingBar from 'client/components/ranking-bar';
import PropertyDescription from 'client/components/property-description'
import  PropertyListItem  from 'client/components/property-list-item';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { DummyComponent } from './helpers/dummyComponent';

const store = createStore(
    reducer,
    composeWithDevTools()
);

// TODO: add corresponding pages to routes components
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
<<<<<<< HEAD
        <Switch>
            <Route exact path='/' component={Search}/>
            <Route path='/search' component={Search}/>
            <Route path='/property/:id' component={DummyComponent}/>
        </Switch>
=======
          <Switch>
              <Route exact path='/' component={Search}/>
              <Route path='/search' component={Search}/>
              <Route path='/property/:id' component={Search}/>
          </Switch>
>>>>>>> origin/50-client-router
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
