import {createAction} from "../../common/commonState";

export const FOCUS_NODE = "FOCUS_NODE";
export const SELECT_NODE = "SELECT_NODE";

export const selectNode = createAction(SELECT_NODE);
export const focusNode = createAction(FOCUS_NODE);

export const graphReducer = (state = {}, {type, payload}) => {
    switch (type) {
        case SELECT_NODE:
            return {...state, selectedNode: payload};
        case FOCUS_NODE: {
            return {...state, focusedNode: payload};
        }
        default:
            return state;
    }
};