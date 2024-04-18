import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const UserInput = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createAsset } = useStateContext();
  const [form, setForm] = useState({
    address: '',
    adminpassword: '',

  });

  const handleFormFieldChange = (fieldName, e) => {
   
    setForm({ ...form, [fieldName]: e.target.value })
  }

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.adminpassword === 'adminpass') {
    setIsLoading(true);
    // await createAsset({ ...form, priceperunit: ethers.utils.parseUnits(form.priceperunit, 18)})
    setIsLoading(false);
    navigate('/user-details', {
      state: { address: form.address },  // Pass address as state to the next route
    });
  } else {
    alert('Provide valid password');
    setForm({ ...form });
  }
}


  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Admin Page</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="User Address*"
            placeholder="0x9E89b95bf4E965Aa9295967f8442701661eEBF21"
            inputType="text"
            value={form.address} 
            handleChange={(e) => handleFormFieldChange('address', e)}
          />
          
          <FormField 
            labelName="Admin Password*"
            placeholder="Your password"
            inputType="text"
            value={form.adminpassword}
            handleChange={(e) => handleFormFieldChange('adminpassword', e)}
          />
        </div>

{/*        
         <FormField 
            labelName="Asset image *"
            placeholder="Place image URL of your asset"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          /> */}

        <div className="flex justify-center items-center mt-[40px]">
            <CustomButton 
              btnType="submit"
              title="Sign In"
              styles="bg-[#1dc071]"
            />
          </div>
      </form>
    </div>
  )
}

export default UserInput