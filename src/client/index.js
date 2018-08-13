import React from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import "client/styles/global.scss";
import reducer from "client/logic/reducer";

// import Search from "client/components/search";
// import Registration from "client/components/registration";
// import LoginComponent from "./components/login";

// import SearchSummary from "client/components/search-summary";
// import AvailabilityPanel from "client/components/availability-panel";
// import RankingBar from "client/components/ranking-bar";
// import PropertyDescription from "client/components/property-description";
// import PropertyListItem from "client/components/property-list-item";
// import {PropertyCreationTabs} from 'client/components/property-creation-tabs'
import { BrowserRouter, Route, Switch } from "react-router-dom";

//import { DummyComponent } from "./helpers/dummyComponent";
import BasicMapWidget from './components/basic-map-widget';
import inputForm from "./components/input-form";


const store = createStore(reducer, composeWithDevTools());

// TODO: add corresponding pages to routes components
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>

                <Route exact path="/" component={inputForm} />
                {/* <Route path="/search" component={Registration} />
                <Route path="/property/:id" component={Registration} />
                <Route path="/add-property/" component={PropertyCreationTabs} /> */}

            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);
