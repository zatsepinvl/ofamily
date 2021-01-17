import React from 'react';
import {withStyles} from 'material-ui/styles';
import {Redirect, Route, Switch} from 'react-router-dom';
import Tree from "../tree/Tree";
import {AppBar, Button, Toolbar, Typography} from "material-ui";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {fetchTrees} from "../tree/state/treesReducer";
import {setTree} from "../graph/state/treeReducer"
import SelectTreeDialog from "./SelectTreeDialog";
import Logo from "../images/logo.png";
import {logout} from "../logout/state/logoutReducer";

const drawerWidth = 200;
const muiStyles = (theme) => ({
    drawer: {
        width: drawerWidth
    },
    appBar: {
        width: '100%',
    },
    flex: {
        flex: 1,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});
const containerStyle = {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10
};
const styles = {
    logo: {
        margin: 10
    }
};

class Home extends React.PureComponent {

    state = {
        selectTreeDialog: false,
    };


    componentDidMount() {
        const {account, fetchTrees} = this.props;
        fetchTrees(account.id);
    }

    componentWillReceiveProps = (newProps) => {
        if (newProps.logout.success) {
            window.location.href = '/';
        }
    };

    handleSelectTree = tree => {
        const {setTree} = this.props;
        setTree(tree);
        this.toggleSelectTreeDialog();
    };

    toggleSelectTreeDialog = () => {
        const {selectTreeDialog} = this.state;
        this.setState({selectTreeDialog: !selectTreeDialog})
    };

    handleLogout = () => {
        this.props.logoutRequest();
    };

    render() {
        const {classes, trees} = this.props;
        const {selectTreeDialog} = this.state;
        return (
            <div style={{height: '100%'}}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <img src={Logo} width="30" height="30" alt="logo" style={styles.logo}/>
                        <Typography
                            type="title"
                            color="inherit"
                            className={classes.flex}
                        >
                            O`Family
                        </Typography>
                        <Button
                            color="contrast"
                            onClick={this.toggleSelectTreeDialog}
                        >
                            My Trees
                        </Button>
                        <Button
                            color="contrast"
                            onClick={this.handleLogout}
                        >
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                <div style={containerStyle}>
                    <Switch>
                        <Route exact path="/tree" component={Tree} style={{width: "100%", height: "100%"}}/>
                        <Redirect to="/not_found"/>
                    </Switch>
                </div>
                <SelectTreeDialog
                    opened={selectTreeDialog}
                    trees={trees}
                    onSelect={this.handleSelectTree}
                    onClose={this.toggleSelectTreeDialog}
                />
            </div>
        )
    }
}


export default withRouter(connect(
    state => ({
        account: state.login,
        tree: state.tree,
        trees: state.trees,
        logout: state.logout,
    }),
    dispatch => ({
        fetchTrees: (accountId) => dispatch(fetchTrees(accountId)),
        setTree: (tree) => dispatch(setTree(tree)),
        logoutRequest: () => dispatch(logout()),
    })
)(withStyles(muiStyles)(Home)));
