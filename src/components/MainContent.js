import React, { useState, useEffect } from 'react';
import '../css/MainContent.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Upload from './bundles/Upload';
import Home from './bundles/Home';
import MyRecords from './bundles/MyRecords';
import SharedWithMe from './bundles/SharedWithMe';

function MainContent( { web3, contract, account, isRegistrar } ) {


    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);


    async function fetchDetails() {
        setLoading(true);
            const recordCount = await contract.methods.recordCount().call();
            let temp = []
            for(let i=1; i<=recordCount; i++) {
                const record = await contract.methods.records(i).call()
                record['permission'] = await contract.methods.getPermission(i, account).call()
                temp.push(record)
            }
            setRecords(temp);
        setLoading(false);
    }

    useEffect(() => {
        fetchDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    
    return (
        !loading ?
            <div className="main__content">
                <Router>
                    <Switch>
                        <Route exact path="/home">
                            <Home 
                                web3 = {web3}
                                account={account} 
                                contract={contract} 
                                records={records}
                            /> 
                        </Route>
                        <Route exact path="/upload">
                            <Upload 
                                account={account} 
                                contract={contract} 
                            />
                        </Route>
                        <Route exact path="/my-records">
                            <MyRecords 
                                account={account} 
                                contract={contract} 
                                records={records}
                            />
                        </Route>
                        <Route exact path="/shared-records">
                            <SharedWithMe 
                                web3 = {web3}
                                account={account} 
                                contract={contract}
                                records={records} 
                            />
                        </Route>
                        <Route path="*" >
                            <Redirect to="/home" />
                        </Route>
                    </Switch>
                </Router>                
            </div>
            :
            <div className="loading__gif">
                <img 
                    src="https://software-advice.imgix.net/base/imageLoading.gif"   
                    alt="logo..."  
                />
            </div>
    )
}

export default MainContent;