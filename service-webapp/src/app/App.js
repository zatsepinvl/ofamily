import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import Home from "../home/Home";
import PageNotFound from "../common/PageNotFound";
import {connect} from "react-redux";
import {connectedRouterRedirect} from 'redux-auth-wrapper/history4/redirect'
import Loading from "../common/Loading";
import {withRouter} from "react-router";
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import Login from "../login/Login";
import {tryLoginRequest} from "../login/state/loginReducer";
import Join from "../join/Join";

const userIsAuthenticated = connectedRouterRedirect({
    redirectPath: '/login',
    authenticatedSelector: state => !!state.login.id,
    wrapperDisplayName: 'UserIsAuthenticated',
    authenticatingSelector: state => state.login.logging,
    AuthenticatingComponent: Loading
});

const locationHelper = locationHelperBuilder({});
const userIsNotAuthenticated = connectedRouterRedirect({
    // This sends the user either to the query param route if we have one, or to the landing page if none is specified and the user is already logged in
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    // This prevents us from adding the query parameter when we send the user away from the login page
    allowRedirectBack: false,
    // Determine if the user is authenticated or not
    authenticatedSelector: state => !state.login.id && !state.login.logging,
    // A nice display name for this check
    wrapperDisplayName: 'UserIsNotAuthenticated'
});

class App extends React.Component {

    componentDidMount() {
        if (!this.props.account.id) {
            this.props.tryLogin();
        }
    }

    render() {
        return (
            <Switch>
                <Redirect exact from="/" to="/tree"/>
                <Route exact path="/not_found" component={PageNotFound}/>
                <Route exact path="/login" component={userIsNotAuthenticated(Login)}/>
                <Route exact path="/join/:id" component={userIsAuthenticated(Join)}/>
                <Route path="/" component={userIsAuthenticated(Home)}/>
            </Switch>
        );
    }
}

export default withRouter(connect(
    state => ({
        account: state.login
    }),
    dispatch => ({
        tryLogin: () => dispatch(tryLoginRequest())
    })
)(App));
