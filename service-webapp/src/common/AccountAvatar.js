import React from 'react';
import {Avatar} from "material-ui";
import PropTypes from 'prop-types';
import {personImage} from "./image";


export default class AccountAvatar extends React.Component {
    render() {
        const {account, style} = this.props;
        return (
            <Avatar
                style={style}
                src={personImage(account)}
            />
        )
    }
}

AccountAvatar.propTypes = {
    style: PropTypes.object,
    account: PropTypes.object,
};
