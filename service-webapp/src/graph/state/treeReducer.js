import {createAction} from "../../common/commonState";

export const LEAVE_TREE = "LEAVE_TREE";
export const SET_TREE = "SET_TREE";

export const leaveTree = createAction(LEAVE_TREE);
export const setTree = (tree) => ({type: SET_TREE, payload: tree});

export const treeReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_TREE:
            return {...action.payload};
        default:
            return state;
    }
};