import {createAction} from "../../common/commonState";

export const FETCH_JOIN_INFO = 'FETCH_JOIN_INFO';
export const SET_JOIN_INFO = 'SET_JOIN_INFO';
export const ACCEPT_JOIN = 'ACCEPT_JOIN';
export const SET_ACCEPT_JOIN = 'SET_ACCEPT_JOIN';

export const fetchJoinInfo = createAction(FETCH_JOIN_INFO);
export const setJoinInfo = createAction(SET_JOIN_INFO);
export const acceptJoin = createAction(ACCEPT_JOIN);
export const setAcceptJoin = createAction(SET_ACCEPT_JOIN);

export const joinReducer = (state = {}, {type, payload}) => {
    switch (type) {
        case FETCH_JOIN_INFO:
            return {fetching: true};
        case SET_JOIN_INFO:
            return {...payload};
        case ACCEPT_JOIN:
            return {...state, accepting: true};
        case SET_ACCEPT_JOIN:
            return {...state, accepting: false, accepted: true};
        default:
            return state;
    }
};