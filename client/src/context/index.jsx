import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useContractWrite, useMetamask } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // const { contract } = useContract('0x5Bb014D2571c3e1799D49fb562e5Bbf7C3F4B20A');
  const { contract } = useContract('0x7989cFE35A5f1A5e4e40C406b7b21829A110A9F7');
  const { mutateAsync: createAsset } = useContractWrite(contract, 'createAsset');
  const {mutateAsync: setUserProfile} = useContractWrite(contract, 'setUserProfile');
  
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

  const getAdminAssetsSell = async (key) => {
    const allAssets = await getAssets();
  
    const filteredAssets = allAssets.filter((asset) => asset.owner === key);
  
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

  const getAdminAssetsBuy = async (key) => {
    const allAssets = await getAssets();
  
    let buyerAssets = [];  // Initialize buyerAssets as an empty array
  
    for (const asset of allAssets) {
      const buyers = await getBuyer(asset.pId);
      let buyersMap={
        buyerAddress: address,
        boughtunits: 0
      };
      for (let j = 0; j < buyers.length; j++) {
        if (buyers[j].buyer === key) {
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

  const uploadProfile = async (form) => {
    try{
      const data= await setUserProfile({
        args:[
          form.name,
          form.image
        ]
      })
    }
    catch(error){
      console.log(error);
    }
  }

  const profileDetails = async () => {
  try {
    // Call the `getUserProfile` function of the contract to get the profile information
    const profile = await contract.call('getUserProfile', [address]);
    console.log(profile);
    return {
      name: profile[0],
      image: profile[1]
    }
  } catch (error) {
    // Handle errors, such as contract call failure or invalid address
    console.error('Error fetching profile details:', error);
    return { name: '', image: '' }; // Return default values or handle error state
  }
};
  
  

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
        getBuyer,
        getAdminAssetsSell,
        getAdminAssetsBuy,
        uploadProfile,
        profileDetails
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);