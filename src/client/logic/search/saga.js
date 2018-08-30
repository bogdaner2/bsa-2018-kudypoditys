import { call, put, takeLatest,all } from 'redux-saga/effects';
import searchService from 'client/services/Service';
import * as actionTypes from './actionTypes';

function* submitSearch(action) {
    try {
        console.log("saga submitSearch")
        const searchResponse = yield call(searchService.submitSearch, action.payload);
        yield put({
            type:actionTypes.SEARCH_SUBMIT_SUCCESS,
            payload: {
                ...searchResponse.data
            }
        });
    }
    catch (error) {
        console.log(error.message)
        yield put({ type:actionTypes.SEARCH_SUBMIT_FAILED})
    }
}

function* updateSearch(action) {
    try {
        yield call(searchService.updateSearch, action.payload);
        yield put({
            type:actionTypes.SEARCH_UPDATE_SUCCESS,
            payload: action.payload
        });
    }
    catch (error) {
        yield put({ type:actionTypes.SEARCH_UPDATE_FAILED})
    }
}

export default function* searchSaga() {
    yield all([
        takeLatest(actionTypes.SEARCH_SUBMIT, submitSearch),
         takeLatest(actionTypes.SEARCH_UPDATE, updateSearch)
    ])
}