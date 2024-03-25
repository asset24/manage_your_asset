import React, { useState, useEffect } from 'react'

import { DisplayAssetsBuy } from '../components';
import { useStateContext } from '../context'

const BoughtAsset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState([]);

  const { address, contract, getBuyerAssets } = useStateContext();

  const fetchAssets = async () => {
    setIsLoading(true);
    const data = await getBuyerAssets();
    setAssets(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchAssets();
  }, [address, contract]);

  return (
    <DisplayAssetsBuy 
      title="All Assets"
      isLoading={isLoading}
      assets={assets}
    />
  )
}

export default BoughtAsset