import {createAction} from "../../common/commonState";

export const LOGOUT = 'LOGOUT';
export const SET_LOGOUT = 'SET_LOGOUT';

export const logout = createAction(LOGOUT);
export const setLogout = createAction(SET_LOGOUT);

export const logoutReducer = (state = {}, {type, payload}) => {
    switch (type) {
        case LOGOUT:
            return {loading: true};
        case SET_LOGOUT:
            return {...payload};
        default:
            return state;
    }
};