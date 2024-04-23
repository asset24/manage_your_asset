import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { DisplayAssets } from '../components';
import { useStateContext } from '../context';

const UserDetails = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [assets, setAssets] = useState([]);
    const [asset2, setAsset2] = useState([]);

    const location = useLocation();
    const { address, contract, getUserAssets, getAdminAssetsSell, getAdminAssetsBuy } = useStateContext();

    const fetchAssets = async () => {
        setIsLoading(true);
        const data = await getAdminAssetsSell(location.state.address); 
        setAssets(data);
        setIsLoading(false);
    };

    const fetchAssets2 = async () => {
        setIsLoading(true);
        const data = await getAdminAssetsBuy(location.state.address); // Use address from location state
        setAsset2(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (contract && address) {
            fetchAssets();
            fetchAssets2();
        } // Check if contract and address are available
    }, [address, contract]);

    return (
        <>
            <DisplayAssets
                title="Assets Sold By The User"
                isLoading={isLoading}
                assets={assets}
            />
            <DisplayAssets
                title="Assets Bought By The User"
                isLoading={isLoading}
                assets={asset2}
            />
        </>

    );
};

export default UserDetails;
