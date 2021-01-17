import React from 'react';
import {withStyles} from 'material-ui/styles';
import Card, {CardContent} from 'material-ui/Card';
import {connect} from "react-redux";
import {Button, List, ListItem, ListItemText, Typography} from "material-ui";
import {fetchTreeAccounts} from "./state/treeAccountsReducer";
import {CardActions, CardHeader} from "../../node_modules/material-ui/Card/index";
import AccountAvatar from "../common/AccountAvatar";
import ShareIcon from "material-ui-icons/Share";
import ConfirmDialog from "../common/ConfirmDialog";
import TreeAvatar from "../common/TreeAvatar";
import ExitToAppIcon from "material-ui-icons/ExitToApp";
import {leaveTree} from "../graph/state/treeReducer";

const muiStyles = theme => ({
    card: {
        position: 'relative',
        maxHeight: 'calc(100vh - 96px)',
        overflow: 'auto'
    },
    media: {
        height: 200,
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    flexGrow: {
        flex: '1 1 auto',
    },
});

const styles = {
    linkInput: {
        width: '100%',
    },
};

class TreeInfoCard extends React.Component {
    state = {};

    componentDidMount() {
    }

    toggleInvitePersonDialog = () => {
        const {invitePersonDialog} = this.state;
        this.setState({invitePersonDialog: !invitePersonDialog});
    };

    toggleLeaveTreeDialog = () => {
        const {leaveTreeDialog} = this.state;
        this.setState({leaveTreeDialog: !leaveTreeDialog});
    };

    handleLeaveTree = (value) => {
        if (value) {
            const {tree, leaveTree} = this.props;
            leaveTree(tree);
        }
        this.toggleLeaveTreeDialog();
    };

    handleFocus = (event) => {
        event.target.select();
    };

    render() {
        const {classes, login, accounts, tree, trees} = this.props;
        const {invitePersonDialog, leaveTreeDialog} = this.state;
        return (
            <Card className={classes.card}>
                <CardHeader title={tree.name}
                            avatar={<TreeAvatar tree={tree}/>}
                />
                <CardContent className={classes.content}>
                    <Typography type="body2">
                        Participants
                    </Typography>
                    <List>
                        {accounts.map((account, i) =>
                            <ListItem key={i} dense>
                                <AccountAvatar account={account}/>
                                <ListItemText primary={`${account.firstName} ${account.lastName}`}
                                              secondary={account.id === login.id ? 'It\'s you' : ''}
                                />
                            </ListItem>
                        )}
                    </List>
                </CardContent>
                <CardActions disableActionSpacing>
                    <Button color="primary"
                            onClick={this.toggleInvitePersonDialog}
                    >
                        <ShareIcon/> Invite person
                    </Button>
                    <ConfirmDialog
                        opened={invitePersonDialog}
                        title="Invite person"
                        content={(
                            <div>
                                Use this url to invite somebody:
                                <br/>
                                <br/>
                                <input
                                    readOnly
                                    style={styles.linkInput}
                                    type='text'
                                    value={`${window.location.origin}/join/${tree.id}`}
                                    onFocus={this.handleFocus}
                                />
                            </div>
                        )}
                        yesText="Got it"
                        onClose={this.toggleInvitePersonDialog}
                    />
                    <div className={classes.flexGrow}/>
                    {trees.length > 1 &&
                    <Button color="primary"
                            onClick={this.toggleLeaveTreeDialog}
                    >
                        <ExitToAppIcon/> Leave tree
                        <ConfirmDialog
                            onClose={this.handleLeaveTree}
                            title="Leave tree"
                            content={`Do you really want to leave ${tree.name} tree?`}
                            opened={leaveTreeDialog}
                            yesText="Leave"
                            noText="Cancel"
                        />
                    </Button>}
                </CardActions>
            </Card>
        );
    }
}

export default connect(
    (state) => ({
        tree: state.tree,
        login: state.login,
        accounts: state.treeAccounts,
        trees: state.trees,
    }),
    (dispatch) => ({
        fetchTreeAccounts: (id) => dispatch(fetchTreeAccounts(id)),
        leaveTree: (tree) => dispatch(leaveTree(tree)),
    })
)(withStyles(muiStyles)(TreeInfoCard));