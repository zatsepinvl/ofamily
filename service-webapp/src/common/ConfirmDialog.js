import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Dialog, {DialogActions, DialogContent, DialogTitle,} from 'material-ui/Dialog';
import {Button} from "material-ui";


const styles = theme => ({});

class ConfirmDialog extends React.Component {

    handleOnCancel = () => {
        this.props.onClose(false);
    };

    handleOnConfirm = () => {
        this.props.onClose(true);
    };

    render() {
        const {opened, title, content, noText, yesText} = this.props;
        return (
            <Dialog open={opened}>
                <form onSubmit={this.handleOnCreate}>
                    <DialogTitle>{title}</DialogTitle>
                    {content && <DialogContent>{content}</DialogContent>}
                    <DialogActions>
                        {noText && <Button onClick={this.handleOnCancel}>
                            {noText}
                        </Button>}
                        <Button color="primary" onClick={this.handleOnConfirm}>
                            {yesText}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

ConfirmDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    opened: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    content: PropTypes.any,
    yesText: PropTypes.string,
    noText: PropTypes.string,
};

ConfirmDialog.defaultProps = {
    yesText: 'Yes',
};
export default withStyles(styles)(ConfirmDialog);