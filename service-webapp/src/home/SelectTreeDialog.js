import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import List, {ListItem, ListItemAvatar, ListItemText} from 'material-ui/List';
import Dialog, {DialogTitle} from 'material-ui/Dialog';
import TreeAvatar from "../common/TreeAvatar";

const muiStyles = {};

class SelectTreeDialog extends React.Component {
    handleSelect = (value) => () => {
        this.props.onSelect(value);
    };

    handleClose = () => {
        this.props.onClose();
    }

    render() {
        const {trees, opened} = this.props;

        return (
            <Dialog open={opened} onRequestClose={this.handleClose}>
                <DialogTitle>Select tree</DialogTitle>
                <div>
                    <List>
                        {trees.map((tree, i) => (
                            <ListItem button onClick={this.handleSelect(tree)} key={i}>
                                <ListItemAvatar>
                                    <TreeAvatar tree={tree}/>
                                </ListItemAvatar>
                                <ListItemText primary={tree.name}/>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Dialog>
        );
    }
}

SelectTreeDialog.propTypes = {
    opened: PropTypes.bool,
    onSelect: PropTypes.func,
    onCreate: PropTypes.func,
    onClose: PropTypes.func,
    trees: PropTypes.array,
};
export default withStyles(muiStyles)(SelectTreeDialog);
