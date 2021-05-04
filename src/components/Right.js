import React from 'react';
import '../css/Right.css';
import Navbar from './Navbar';
import MainContent from './MainContent';

function Right( { web3, contract, networkId, account } ) {
    return (
        <div className="right">
            <div className="right__top">
                <Navbar 
                    account = {account}
                />
            </div>
            <div className="right__body">
                <MainContent 
                    web3 = {web3}
                    account = {account}
                    networkId = {networkId}
                    contract = {contract}
                />
            </div>
        </div>
    )
}

export default Right;