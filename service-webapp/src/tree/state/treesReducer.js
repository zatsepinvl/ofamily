import {createAction} from "../../common/commonState";

export const FETCH_TREES = "FETCH_TREES";
export const SET_TREES = "SET_TREES";

export const fetchTrees = createAction(FETCH_TREES);
export const setTrees = createAction(SET_TREES);

export const treesReducer = (state = [], {type, payload}) => {
    switch (type) {
        case SET_TREES:
            return [...payload];
        default:
            return state;
    }
};