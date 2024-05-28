import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../constants';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [profile, setProfile] = useState({ name: 'Upload', image: '' });
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { address, contract, profileDetails, connect } = useStateContext();

  const fetchAssets = async () => {
    const data = await profileDetails();
    setProfile(data);
  };

  useEffect(() => {
    if (contract) fetchAssets();
  }, [address, contract]);

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between items-center mb-4 md:mb-0 gap-6">
      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center relative">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-300 flex justify-center items-center">
          <img src={logo} alt="user" className="w-6 h-6 object-contain" />
        </div>
        <img
          src={menu}
          alt="menu"
          className="w-6 h-6 object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-16 right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 transform ${toggleDrawer ? 'translate-y-0' : 'translate-y-full'
            } transition-all duration-300 md:hidden`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-6 h-6 object-contain ${isActive === link.name ? 'filter-none' : 'filter grayscale'
                    }`}
                />
                <p className={`ml-2 font-semibold text-sm ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                  {link.name}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex justify-center">
            <CustomButton
              btnType="button"
              title={address ? `${address}` : 'Login'}
              styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
              handleClick={() => {
                if (address) navigate('create-asset');
                else connect();
              }}
            />
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center">
        <CustomButton
          btnType="button"
          title={address ? `${address}` : 'Login'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handleClick={() => {
            if (address) navigate('create-asset');
            else connect();
          }}
        />
        <div className="flex items-center ml-4">
          {profile.image ? (
            <Link to="/profile-upload">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
              <img src={profile.image} alt="user" className="w-full h-full object-cover" />
            </div>
            </Link>

          ) : (
            <Link to="/profile-upload">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center relative overflow-hidden">
                {/* Render a text indicating upload if profile image doesn't exist */}
                <p className="text-white text-sm absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">Upload</p>
                {/* You can also add an upload icon here */}
                <svg className="h-6 w-6 text-gray-400 absolute inset-0 m-auto opacity-50 hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>

            </Link>
          )}
          <div className="ml-2">
            <p className="text-white font-semibold">{profile.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
