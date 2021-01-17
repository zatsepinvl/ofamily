import React from 'react';
import {CircularProgress, Typography} from 'material-ui';
import PropTypes from 'prop-types';

const styles = {
        box: {
            position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
            display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center',
        },
        cover: {
            backgroundColor: 'rgba(253, 253, 253, 0.9)', zIndex: 999
        },
        caption: {
            marginTop: 10
        }
    }
;

class Loading extends React.PureComponent {
    render() {
        const {caption, show, cover} = this.props;
        const style = {...styles.box, ...(cover ? styles.cover : {})};
        return (
            <div>
                {show && <div style={style}>
                    <CircularProgress/>
                    <Typography type="caption"
                                align="center"
                                style={styles.caption}
                    >
                        {caption}
                    </Typography>
                </div>}
            </div>
        )
    }
}

Loading.propTypes = {
    caption: PropTypes.string,
    show: PropTypes.bool,
    style: PropTypes.object,
    cover: PropTypes.bool,
};

Loading.defaultProps = {
    caption: 'Loading...',
    show: true
};

export default Loading;