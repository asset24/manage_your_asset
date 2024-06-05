import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CustomButton, FormField, Loader } from '../components';

const SellAsset = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { sellAssetFunction } = useStateContext();
  const [form, setForm] = useState({
    purchaseId: '',
    quantity: 0,
    price: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    let value = e.target.value;

    if (fieldName === "quantity" && value < 0) {
      value = 0;
    }

    setForm({ ...form, [fieldName]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.quantity <= 0 || form.price <= 0) {
      alert('Quantity and price must be greater than zero');
      return;
    }

    try {
      setIsLoading(true);
      console.log("Purchase Id : ",form.purchaseId, "Quantity : ", form.quantity, "Ether : ",ethers.utils.parseUnits(form.price, 18))
      await sellAssetFunction(form.purchaseId, form.quantity, ethers.utils.parseUnits(form.price, 18));
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error selling asset:', error);
      setIsLoading(false);
      alert('Failed to sell asset');
    }
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Sell Asset</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Purchase ID *"
            placeholder="Enter purchase ID"
            inputType="number"
            value={form.purchaseId}
            handleChange={(e) => handleFormFieldChange('purchaseId', e)}
          />
          <FormField 
            labelName="Quantity *"
            placeholder="Enter quantity"
            inputType="number"
            value={form.quantity}
            handleChange={(e) => handleFormFieldChange('quantity', e)}
          />
        </div>

        <FormField 
          labelName="Price per Unit (ETH) *"
          placeholder="Enter price per unit"
          inputType="text"
          value={form.price}
          handleChange={(e) => handleFormFieldChange('price', e)}
        />
        
        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton 
            btnType="submit"
            title="Sell Asset"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default SellAsset;