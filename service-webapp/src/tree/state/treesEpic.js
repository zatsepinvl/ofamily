import {combineEpics} from 'redux-observable';
import {createApiEpic} from "../../common/apiEpic";
import {FETCH_TREES, setTrees} from "./treesReducer";
import {Observable} from 'rxjs/Observable';
import {setTree} from "../../graph/state/treeReducer";

const fetchTreesEpic = createApiEpic(
    FETCH_TREES,
    (api, {payload}) => api.get(`/api/accounts/${payload}/trees`)
        .flatMap(trees => {
            return Observable.concat(
                Observable.of(setTrees(trees)),
                Observable.of(setTree(trees[0]))
            )
        }),
);

export const treesEpic = combineEpics(
    fetchTreesEpic,
);
