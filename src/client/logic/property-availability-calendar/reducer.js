import defaultState from "client/logic/defaultState";
import {
    PROPERTY_CALENDAR_UPDATE,
    AVAILABILITY_UPDATE_SUBMIT
} from "./actionTypes";

export default (state = defaultState.availabilityCalendar, action) => {
    switch (action.type) {
        case PROPERTY_CALENDAR_UPDATE: {
            return {
                ...state,
                ...action.payload
            };
        }
        case AVAILABILITY_UPDATE_SUBMIT: {
            return {
                ...state,
                ...action.payload
            };
        }
        default: {
            return state;
        }
    }
};
