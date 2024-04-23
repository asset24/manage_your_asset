import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import FundCardBuy from './FundCardBuy';
import { loader } from '../assets';

const   DisplayAssetsBuy = ({ title, isLoading, assets }) => {
  const navigate = useNavigate();

  const handleNavigate = (asset) => {
    navigate(`/asset-details/${asset.title}`, { state: asset })
  }
  
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({assets.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && assets.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not bought any assets yet
          </p>
        )}

        {!isLoading && assets.length > 0 && assets.map((asset) => <FundCardBuy 
          key={uuidv4()}
          {...asset}
          handleClick={() => handleNavigate(asset)}
        />)}
      </div>
    </div>
  )
}

export default DisplayAssetsBuy