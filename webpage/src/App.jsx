import './App.css';
import Heading from './components/Heading.jsx'
import Inputform from './components/Inputform.jsx'
import Listings from './components/Listings.jsx';
import { ConnectToMetaMask } from './backend/backend.js';
import { useState, useEffect } from 'react';

const SEPOLIA_TX_URL = "https://sepolia.etherscan.io/tx";

function App() {
  const [ connect, setConnect ] = useState(false);
  const [ contract, setContract ] = useState(undefined);
  const [ userAccount, setUserAccount ] = useState(undefined);
  const [ listItemHash, setListItemHash ] = useState(undefined);
  const [ buyItemHash, setBuyItemHash ] = useState(undefined);
  const [ listingRefresh, setListingRefresh ] = useState(false);

  useEffect(() => {
    async function handleConnect() {
      let [ contract, userAccount ] = await ConnectToMetaMask();

      console.log(`contract: ${contract}`);
      console.log(`userAccount: ${userAccount}`);

      setContract(contract);
      setUserAccount(userAccount);
      setListingRefresh(true);
    }

    if (connect) {
      handleConnect();
      setConnect(false);
    }
  }, [ connect ]);

  useEffect(() => {
    if (listItemHash) {
      setListingRefresh(true);

      if (confirm(`Item Listed, hash: ${listItemHash}. Proceed to confirmation?`)) {
        window.open(`${SEPOLIA_TX_URL}/${listItemHash}`, '_blank');
      }
    }
  }, [ listItemHash ]);

  useEffect(() => {
    if (buyItemHash) {
      setListingRefresh(true);

      if (confirm(`Item Purchased, hash: ${buyItemHash}. Proceed to confirmation?`)) {
        window.open(`${SEPOLIA_TX_URL}/${buyItemHash}`, '_blank');
      }
    }
  }, [ buyItemHash ]);

  return (
    <>
    <Heading/>
    {!userAccount &&
    <div className='connect' >
    <button className='connectbutton' onClick={() => setConnect(true)}>Connect Wallet!</button>
    </div>
    }
    <br/>
    {userAccount && <Inputform contract={contract} userAccount={userAccount} setListItemHash={setListItemHash} />}
    {userAccount && <Listings contract={contract} userAccount={userAccount} setBuyItemHash={setBuyItemHash} externalRefresh={listingRefresh} setExternalRefresh={setListingRefresh} />}
    </>
  );

}

export default App
