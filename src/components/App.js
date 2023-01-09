import React, { useState, useEffect } from 'react';
import '../css/App.css';
import MediChainContract from '../abis/MediChain.json';
import getWeb3 from '../getWeb3';
import { ReactNotifications } from 'react-notifications-component';
import Left from './Left';
import Right from './Right';

function App() {

    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [networkId, setNetworkId] = useState('');
    const [medichainContract, setMedichainContract] = useState(null);
    // const [contractAddress, setContractAddress] = useState(null);
    
    async function establishConnection() {
      const web = await getWeb3();
      setWeb3(web);
      const accounts = await web.eth.getAccounts();
      setAccount(accounts[0]);
      const nwId = await web.eth.net.getId();
      setNetworkId(nwId);
      const networkData = MediChainContract.networks[nwId];

      window.ethereum.on('accountsChanged', function (accounts) {
        setAccount(accounts[0]);
        window.location.reload();
      })

      if(networkData) {
          const contract = new web.eth.Contract(MediChainContract.abi, networkData.address);
          setMedichainContract(contract);
      } 
      else {
          window.alert('Your Contracts not deployed to detected network.')
      }
  }

  useEffect(() => {
      establishConnection();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  

  return (
    medichainContract
    ?
    <div className="app">
      <div className="app__body">
        <ReactNotifications />
        <Left 
            web3 = {web3}
            account = {account}
            networkId = {networkId}
            contract = {medichainContract}
        />
        <Right 
            web3 = {web3}
            account = {account}
            networkId = {networkId}
            contract = {medichainContract}
        /> 
      </div>
    </div>
    :
    <div className="app__loading__gif">
        <img 
          style={{display:'block', margin:'auto'}}
          src="https://software-advice.imgix.net/base/imageLoading.gif"  
          alt="logo..."    
        />
    </div>
  );
}

export default App;