import React from 'react';
import {Dialog, IconButton} from 'material-ui';
import PropTypes from 'prop-types';
import {withStyles} from "material-ui/styles";
import CloseIcon from "material-ui-icons/Close";

const styles = {
    coverBox: {},
    button: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    image: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        margin: 'auto'
    }
};

class ImageView extends React.Component {
    render() {
        const {src, classes} = this.props;
        return (
            <Dialog
                fullScreen
                open={true}
                className={classes.coverBox}
                maxWidth={'360md'}
            >
                <IconButton className={classes.button}>
                    <CloseIcon/>
                </IconButton>
                <img src={src} style={styles.image}/>
            </Dialog>
        )
    }
}

ImageView.propTypes = {
    src: PropTypes.string
};

export default withStyles(styles)(ImageView);