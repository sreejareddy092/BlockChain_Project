import Web3 from 'web3';
import { useState, useEffect } from 'react';
import { GetCount, GetItem, BuyItem } from '../backend/backend.js';

const Listings = ({contract, userAccount, setBuyItemHash, externalRefresh, setExternalRefresh}) => {
  const web3 = new Web3(window.ethereum);
  const [ fetchItems, setFetchItems ] = useState(true);
  const [ buyItem, setBuyItem] = useState({idx: -1, price: 0});
  const [ items, setItems ] = useState([]);

  useEffect(() => {
    if (externalRefresh) {
      setFetchItems(true);
      setExternalRefresh(false);
    }
  }, [ externalRefresh ]);

  useEffect(() => {
    async function getItems() {
      if (!contract) {
        console.log("Waiting for the contract to be updated");
        return;
      }

      const count = await GetCount(contract);
      console.log("Count: " + count);

      let newItems = [];

      for (let idx = 0; idx < count; idx++) {
        const item = await GetItem(contract, idx);
        newItems.push({idx: idx, item: item});

      }

      setItems(newItems);

      console.log(`items: ${newItems}`);
    }

    if (fetchItems) {
      getItems();
      setFetchItems(false);
    }
  }, [ fetchItems ]);

  useEffect(() => {
    async function handlePurchase() {
      if (!setBuyItemHash) {
        console.log("setBuyItemHash missing");
        return;
      }

      let reciept = await BuyItem(contract, userAccount, buyItem.idx, buyItem.price);

      console.log(`list hash: ${reciept.transactionHash}`);
      setBuyItemHash(reciept.transactionHash);
    }

    if (-1 != buyItem.idx) {
      handlePurchase();
      setBuyItem({idx: -1, price: 0});
    }
  },[ buyItem ]);

  return(
    <>
    <br/>
    <button onClick={() => setFetchItems(true)}>Refresh</button>
    <br/>
    <ul>
      {items.map(
        el => (<li key={el.idx}><p>{el.idx} : {el.item.name} : {el.item.desc} : {web3.utils.fromWei(el.item.price, "ether")} : { el.item.buyer == 0 ? (<button onClick={() => setBuyItem({idx: el.idx, price: el.item.price})}>buy</button>) : (<>Already bought</>) }</p></li>)
      )}
    </ul>
    </>
  );
};

export default Listings;
