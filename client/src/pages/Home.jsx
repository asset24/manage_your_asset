import React, { useState, useEffect } from 'react'

import { DisplayAssets } from '../components';
import { useStateContext } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState([]);

  const { address, contract, getAssets } = useStateContext();

  const fetchAssets = async () => {
    setIsLoading(true);
    const data = await getAssets();
    setAssets(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchAssets();
  }, [address, contract]);

  return (
    <DisplayAssets 
      title="All Assets"
      isLoading={isLoading}
      assets={assets}
    />
  )
}

export default Home