import {combineEpics} from 'redux-observable';
import {LEAVE_TREE, setTree} from "./treeReducer";
import {createApiEpic} from "../../common/apiEpic";
import {setTrees} from "../../tree/state/treesReducer";
import {Observable} from 'rxjs/Observable';

const leaveTreeEpic = createApiEpic(
    LEAVE_TREE,
    (api, {payload}, store) => {
        const tree = payload;
        const loginId = store.getState().login.id;
        const trees = store.getState().trees;

        tree.accounts.splice(tree.accounts.indexOf(loginId), 1);
        trees.splice(trees.indexOf(tree), 1);
        return api.put(`/api/trees/${payload.id}`, payload)
            .flatMap(response => Observable.concat(
                Observable.of(setTrees(trees)),
                Observable.of(setTree(trees[0])),
            ));
    }
);

export const treeEpic = combineEpics(
    leaveTreeEpic,
);
