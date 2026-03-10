import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets'; // Adjust path based on your folder structure

const Profile = () => {

const { user, token, navigate } = useContext(ShopContext);
useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!user) {
    return <div className="text-center p-20">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-12 animate-fadeIn">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 shadow-sm mb-4">
          <span className="text-3xl font-light text-gray-500">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">{user.name}</h1>
        <p className="text-gray-500 font-light">{user.email}</p>
      </div>

      <hr className="border-gray-100 mb-12" />

      {/* Navigation Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* My Orders Card */}
        <div 
          onClick={() => navigate('/orders')}
          className="group cursor-pointer p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <img className="w-6 opacity-70" src={assets.parcel_icon} alt="Orders" />
            </div>
            <span className="text-gray-300 group-hover:text-blue-500 transition-colors">→</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800">My Orders</h3>
          <p className="text-sm text-gray-500 mt-1 font-light italic">
            Check your order history and tracking status.
          </p>
        </div>

        {/* Collection Card */}
        <div 
          onClick={() => navigate('/collection')}
          className="group cursor-pointer p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
              {/* Replace with a 'Grid' or 'Menu' icon from your assets */}
              <img className="w-6 opacity-70" src={assets.menu_icon} alt="Collection" />
            </div>
            <span className="text-gray-300 group-hover:text-orange-500 transition-colors">→</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800">Browse Collection</h3>
          <p className="text-sm text-gray-500 mt-1 font-light italic">
            Explore our latest Mandalas and Art pieces.
          </p>
        </div>

      </div>

      {/* Footer Logout Option */}
      <div className="mt-16 text-center">
        <button 
          onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors underline underline-offset-4"
        >
          Logout from Account
        </button>
      </div>
    </div>
  );
};

export default Profile;