import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

const AssetDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toBuyAsset, getBuyer, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [buyers, setBuyers] = useState([]);


  const fetchBuyers = async () => {
    const data = await getBuyer(state.pId);
    setBuyers(data);
  }

  useEffect(() => {
    if(contract) fetchBuyers();
  }, [contract, address])

  const handletoBuyAsset = async () => {
    setIsLoading(true);

    await toBuyAsset(state.pId, amount); 

    navigate('/')
    setIsLoading(false);
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="asset" className="w-full h-[410px] object-cover rounded-xl"/>
          {/* <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.priceperunit, state.available)}%`, maxWidth: '100%'}}>
            </div>
          </div> */}
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Price per unit" value={state.priceperunit} />
          <CountBox title={`Available`} value={state.available} />
          <CountBox title="Total Quantity" value={state.quantity} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]"></p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Description</h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
              </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Buyers</h4>

              <div className="mt-[20px] flex flex-col gap-4">
                {buyers.length > 0 ? buyers.map((item, index) => (
                  <div key={`${item.buyer}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.buyer}</p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.boughtunits}</p>
                  </div>
                )) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No buyers yet. Be the first one!</p>
                )}
              </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Buy</h4>   

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
               Buy the asset
            </p>
            <div className="mt-[30px]">
              <input 
                type="number"
                placeholder="0"
                step="1"
                min="0"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
              </div>

              <CustomButton 
                btnType="button"
                title="Buy Asset"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handletoBuyAsset}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetDetails