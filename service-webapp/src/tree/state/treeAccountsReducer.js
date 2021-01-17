import {createAction} from "../../common/commonState";

export const FETCH_TREE_ACCOUNTS = 'FETCH_TREE_ACCOUNTS';
export const SET_TREE_ACCOUNTS = 'SET_TREE_ACCOUNTS';

export const fetchTreeAccounts = createAction(FETCH_TREE_ACCOUNTS);
export const setTreeAccounts = createAction(SET_TREE_ACCOUNTS);

export const treeAccountsReducer = (state = [], {type, payload}) => {
    switch (type) {
        case SET_TREE_ACCOUNTS:
            return [...payload];
        default:
            return state;
    }
};