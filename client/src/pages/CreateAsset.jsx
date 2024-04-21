import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const CreateAsset = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createAsset } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    priceperunit: '', 
    quantity: 0,
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    let value = e.target.value;

    if ((fieldName === "quantity" || fieldName === "priceperunit") && value < 0) {
      value = 0;
    }

    setForm({ ...form, [fieldName]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createAsset({ ...form, priceperunit: ethers.utils.parseUnits(form.priceperunit, 18) });
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Provide a valid image URL');
        setForm({ ...form, image: '' });
      }
    });
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Asset Details</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField 
            labelName="Asset Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField 
          labelName="Description *"
          placeholder="Write a Brief description"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Price Per Unit*"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.priceperunit}
            handleChange={(e) => handleFormFieldChange('priceperunit', e)}
          />
          <FormField 
            labelName="Quantity *"
            placeholder="10"
            inputType="number"
            value={form.quantity}
            min="0"
            handleChange={(e) => handleFormFieldChange('quantity', e)}
          />
        </div>

        <FormField 
          labelName="Asset image *"
          placeholder="Place image URL of your asset"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />
        
        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton 
            btnType="submit"
            title="Submit new asset"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateAsset;
