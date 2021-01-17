import React from 'react';
import {Avatar} from "material-ui";
import PropTypes from 'prop-types';
import {treeImage} from "./image";


export default class TreeAvatar extends React.Component {
    render() {
        const {tree, style} = this.props;
        return (
            <Avatar
                style={style}
                src={treeImage(tree)}
            />
        )
    }
}

TreeAvatar.propTypes = {
    style: PropTypes.object,
    tree: PropTypes.object,
};
