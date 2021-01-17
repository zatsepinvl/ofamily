import {combineEpics} from 'redux-observable';
import {createApiEpic} from "../../common/apiEpic";
import {FETCH_TREE_ACCOUNTS, fetchTreeAccounts, setTreeAccounts} from "./treeAccountsReducer";
import {SET_TREE} from "../../graph/state/treeReducer";
import {createOnEpic} from "../../common/chainEpic";
import {Observable} from 'rxjs/Observable';

const treeAccountsFetchEpic = createApiEpic(
    FETCH_TREE_ACCOUNTS,
    (api, {payload}) => api.get(`/api/trees/${payload}/accounts`),
    setTreeAccounts
);

const treeAccountsFetchOnTreeSelectEpic = createOnEpic({
    type: SET_TREE,
    flatMap: ({payload}) => Observable.of(fetchTreeAccounts(payload.id))
});

export const treeAccountEpic = combineEpics(
    treeAccountsFetchEpic,
    treeAccountsFetchOnTreeSelectEpic
);