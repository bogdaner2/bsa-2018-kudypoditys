import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import 'client/styles/global.scss';
import reducer from 'client/logic/reducer';

import Search from 'client/components/search';
import RankingBar from 'client/components/ranking-bar';
const store = createStore(
    reducer,
    composeWithDevTools()
);

ReactDOM.render(
    <Provider store={store}>
        <React.Fragment>
            {[
                <Search
                    key="Search"
                    view='bar'
                />,
                <RankingBar
                    key="RankingBar"
                />


            ]}
        </React.Fragment>

    </Provider>,
    document.getElementById('root')
);
