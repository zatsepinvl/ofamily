import React from 'react';
import {connect} from "react-redux";
import {withStyles} from "material-ui/styles";
import {acceptJoin, fetchJoinInfo} from "./state/joinReducer";
import {Button, Card, Checkbox, Icon, List, Typography} from "material-ui";
import {CardContent, CardHeader} from "../../node_modules/material-ui/Card/index";
import {ListItem, ListItemText} from "../../node_modules/material-ui/List/index";
import AccountAvatar from "../common/AccountAvatar";
import Loading from "../common/Loading";

const muiStyles = theme => ({
    card: {
        maxWidth: 300,
        margin: 10,
        width: 300,
    },
    flexGrow: {
        flex: '1 1 auto',
    },
    list: {
        maxHeight: 'calc(100vh - 200px)',
        overflow: 'auto',
    }
});

const styles = {
    container: {
        display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        position: 'relative',
        width: '100%', height: '100vh',
    },
};

class Join extends React.Component {
    state = {
        checked: [],
    };

    componentDidMount() {
        const {match, login, fetchJoinInfo} = this.props;
        fetchJoinInfo(login.id, match.params.id);
    }

    componentWillReceiveProps(newProps) {
        const {join} = newProps;
        if (join.fromTree && join.toTree && join.fromTree.id === join.toTree.id) {
            this.goHome();
        }
        if (join.accepted) {
            this.goHome();
        }
    }

    handleToggle = value => () => {
        const {checked} = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    handleAcceptJoin = () => {
        const {acceptJoin, match} = this.props;
        const {checked} = this.state;
        acceptJoin(match.params.id, checked);
    };

    handleCancelJoin = () => {
        this.goHome();
    };

    goHome = () => {
        const {history} = this.props;
        history.push('/tree')
    };

    render() {
        const {classes, join, login} = this.props;
        const {fromPersons, toPersons} = join;
        if (!join.fromPersons) {
            return (
                <div style={styles.container}>
                    <Loading show={true} caption="Login..."/>
                </div>
            );
        }
        return (
            <div style={styles.container}>
                <div>
                    <Card className={classes.card}>
                        <CardHeader title="Your tree"/>
                        <CardContent className={classes.content}>
                            <Typography type="body2">
                                Choose persons to move to another tree
                            </Typography>
                            <List className={classes.list}>
                                {fromPersons.map((person, i) =>
                                    <ListItem key={i}
                                              dense
                                              button
                                              onClick={this.handleToggle(person)}>
                                        <Checkbox
                                            checked={this.state.checked.indexOf(person) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                        <AccountAvatar account={person}/>
                                        <ListItemText primary={`${person.firstName} ${person.lastName}`}
                                                      secondary={person.id === login.id ? 'It\'s you' : ''}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </div>
                {join.accepting &&
                <div style={{position: 'relative', margin: 44}}>
                    <Loading show={join.accepting} caption=""/>
                </div>}
                {!join.accepting &&
                <div style={{textAlign: 'center'}}>
                    <div>
                        <Button color="primary"
                                onClick={this.handleAcceptJoin}
                        >
                            Accept
                        </Button>
                    </div>
                    <div>
                        <Icon color="primary" style={{fontSize: 50}}>trending_flat</Icon>
                    </div>
                    <div>
                        <Button onClick={this.handleCancelJoin}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>}
                <div>
                    <Card className={classes.card}>
                        <CardHeader title="Another tree"/>
                        <CardContent className={classes.content}>
                            <List className={classes.list}>
                                {toPersons.map((person, i) =>
                                    <ListItem key={i} dense>
                                        <AccountAvatar account={person}/>
                                        <ListItemText primary={`${person.firstName} ${person.lastName}`}/>
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        login: state.login,
        join: state.join,
    }),
    dispatch => ({
        fetchJoinInfo: (accountId, treeId) => dispatch(fetchJoinInfo({accountId, treeId})),
        acceptJoin: (treeId, persons) => dispatch(acceptJoin({treeId, persons})),
    })
)(withStyles(muiStyles)(Join));