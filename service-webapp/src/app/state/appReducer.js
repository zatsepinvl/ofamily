import {errorReducer} from "./errorReducer";
import {combineReducers} from "redux";
import {treeReducer} from "../../graph/state/treeReducer";
import {personsReducer} from "../../graph/state/personsReducer";
import {personsSelectedReducer} from "../../graph/state/personsSelectedReducer";
import signupReducer from "../../login/state/signupReducer";
import loginReducer from "../../login/state/loginReducer";
import {graphReducer} from "../../graph/state/graphReducer";
import {treeAccountsReducer} from "../../tree/state/treeAccountsReducer";
import {joinReducer} from "../../join/state/joinReducer";
import {treesReducer} from "../../tree/state/treesReducer";
import {logoutReducer} from "../../logout/state/logoutReducer";


export const appReducer = combineReducers({
    login: loginReducer,
    signup: signupReducer,
    logout: logoutReducer,
    errors: errorReducer,
    tree: treeReducer,
    trees: treesReducer,
    treeAccounts: treeAccountsReducer,
    persons: personsReducer,
    selectedPerson: personsSelectedReducer,
    graph: graphReducer,
    join: joinReducer,
});

