import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useContractWrite, useMetamask } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // const { contract } = useContract('0x5Bb014D2571c3e1799D49fb562e5Bbf7C3F4B20A');
  const { contract } = useContract('0x5264d88f24CA065bCc408B55F75694CaC193020A');
  const { mutateAsync: createAsset } = useContractWrite(contract, 'createAsset');

  const address = useAddress();
  const connect = useMetamask();

  const publishAsset = async (form) => {
    try {
      const data = await createAsset({
				args: [
					address, // owner
					form.title, // title
					form.description, // description
					form.quantity,
          form.priceperunit,
					form.image,
				],
			});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getAssets = async () => {
    const assets = await contract.call('getAssets');
    const parsedAssets = assets.map((asset, i) => (
      {
      owner: asset.owner,
      title: asset.title,
      description: asset.description,
      priceperunit: asset.price ? ethers.utils.formatEther(asset.price.toString()) : '',
      quantity: asset.quantity ? asset.quantity.toString() : '',
      available: asset.available.toString(),
      image: asset.image,
      buyer: asset.buyer,
      boughtunits: asset.boughtunits,
      pId: i
    }));

    return parsedAssets;
  }

  const getUserAssets = async () => {
    const allAssets = await getAssets();

    const filteredAssets = allAssets.filter((asset) => asset.owner === address);

    return filteredAssets;
  }

  
  

  const toBuyAsset = async (pId, amount) => {
    const data = await contract.call('toBuyAsset', [pId], { value:parseInt(amount, 10)});
    return data;
  }

  const getBuyer = async (pId) => {
    const buyer = await contract.call('getAssetBuyer', [pId]);
    const numberOfBuyer = buyer[0].length;

    const parsedBuyer = [];

    for(let i = 0; i < numberOfBuyer; i++) {
      parsedBuyer.push({
        buyer: buyer[0][i],
        boughtunits: buyer[1][i].toString(),
      })
    }
    return parsedBuyer;
  }

  const getBuyerAssets = async () => {
    const allAssets = await getAssets();
  
    let buyerAssets = [];  // Initialize buyerAssets as an empty array
  
    for (const asset of allAssets) {
      const buyers = await getBuyer(asset.pId);
      let buyersMap={
        buyerAddress: address,
        boughtunits: 0
      };
      for (let j = 0; j < buyers.length; j++) {
        if (buyers[j].buyer === address) {
          buyersMap.boughtunits+=parseInt(buyers[j].boughtunits, 10); 
        }
      }
      if (buyersMap.boughtunits > 0) {
        buyerAssets.push({
          owner: asset.owner,
          title: asset.title,
          description: asset.description,
          priceperunit: asset.priceperunit,
          quantity: asset.quantity,
          available: buyersMap.boughtunits,
          image: asset.image,
          pId: asset.pId
        });
      }

    }
  
    return buyerAssets;
  }
  
  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createAsset: publishAsset,
        getAssets,
        getUserAssets,
        toBuyAsset,
        getBuyerAssets,
        getBuyer
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);