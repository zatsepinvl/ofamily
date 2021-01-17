import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs/Observable';
import {createApiEpic} from "../../common/apiEpic";
import {ACCEPT_JOIN, FETCH_JOIN_INFO, setAcceptJoin, setJoinInfo} from "./joinReducer";


const fetchJoinInfoEpic = createApiEpic(
    FETCH_JOIN_INFO,
    (api, {payload}) =>
        api.get(`/api/accounts/${payload.accountId}/trees`)
            .flatMap(trees => {
                const fromTree = trees[0];
                const $fromPersons = api.get(`/api/trees/${fromTree.id}/persons`);
                const $toTree = api.get(`/api/trees/${payload.treeId}`);
                const $toPersons = api.get(`/api/trees/${payload.treeId}/persons`);
                return Observable.zip(
                    $fromPersons,
                    $toTree,
                    $toPersons,
                    (fromPersons, toTree, toPersons) => setJoinInfo({
                        fromPersons: fromPersons,
                        toPersons: toPersons,
                        fromTree: fromTree,
                        toTree: toTree,
                    })
                );
            })
);


const acceptJoinInfoEpic = createApiEpic(
    ACCEPT_JOIN,
    (api, {payload}, store) => {
        const toTree = {...store.getState().join.toTree};
        const accountId = store.getState().login.id;
        toTree.accounts.push(accountId);
        return Observable.merge(
            api.put(`/api/trees/${toTree.id}`, toTree),
            api.post(`/api/trees/${payload.treeId}/persons`, payload.persons)
        );
    },
    setAcceptJoin
);

export const joinEpic = combineEpics(
    fetchJoinInfoEpic,
    acceptJoinInfoEpic
);