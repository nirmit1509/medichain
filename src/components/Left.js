import React from 'react';
import '../css/Left.css';
import AddIcon from '@material-ui/icons/Add';
import logo from '../assets/logo.png';

function Left( { web3, contract, networkId, account } ) {

    return (
        <div className="left">
            <div className="left__top">
                <img 
                    src = {logo} 
                    alt = "MediChain Logo"
                />
                <h3>MediChain</h3>
            </div>
            <div className="left__middle">
                <ul id="items">            
                    <li className="add__property"> <AddIcon /> <a href="/upload">Upload</a> </li>
                    <li> <a href="/home">Home</a> </li>
                    <li> <a href="/my-records">My Records</a> </li>
                    <li> <a href="/shared-records">Shared With Me</a> </li>
                </ul>
            </div>
            <div className="left__bottom">
                <ul id="items">
                    {/* <HelpOutlineIcon /><li>Find your public key</li> */}
                </ul>
            </div>
        </div>
    )
}

export default Left;