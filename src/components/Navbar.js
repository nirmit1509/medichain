import React from 'react';
import '../css/Navbar.css';
import { Avatar } from "@material-ui/core";

function Navbar( { account } ) {
    return (
        <div className="navbar">
            <small>{`${account.slice(0, -20)}....${account.slice(37, 42)}`}</small>
            <Avatar src={`https://avatars.dicebear.com/api/avataaars/${account}.svg`} />
        </div>
    )
}

export default Navbar;
