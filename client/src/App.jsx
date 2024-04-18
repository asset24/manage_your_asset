import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Sidebar, Navbar } from './components';
import { AssetDetails, CreateAsset, Home, Profile, BoughtAsset, UserInput, UserDetails } from './pages';

const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-asset" element={<CreateAsset />} />
          <Route path="/asset-details/:id" element={<AssetDetails />} />
          <Route path="/bought-asset" element={<BoughtAsset />} />
          <Route path="/admin-page" element={<UserInput />} />
          <Route path="/user-details" element={<UserDetails />} />
        </Routes>
      </div>
    </div>
  )
}

export default App