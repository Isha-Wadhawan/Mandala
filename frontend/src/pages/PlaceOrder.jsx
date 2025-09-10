import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import { QRCodeCanvas } from "qrcode.react";

const PlaceOrder = () => {
  const { backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName:'' , 
    lastName : '', 
    email : '', 
    street : '', 
    city : '', 
    state : '', 
    zipcode : '', 
    country : '', 
    phone : ''
  });

  const onChangeHandler = (e)=>{
    const { name, value } = e.target;
    setFormData(data => ({...data, [name]: value}))
  };

  // calculate final amount
  const amount = getCartAmount() + delivery_fee;

  // create dynamic UPI link
  const upiLink = `upi://pay?pa=8447326153@ptaxis&pn=MandalaByJigyasa&am=${amount}&cu=INR`;

  // detect mobile
  const isMobile = /Android|iPhone/i.test(navigator.userAgent);

  const onSubmitHandler = async(e)=>{
    e.preventDefault();

    // Here, just redirect to payment (no auto verification)
    if (isMobile) {
      window.location.href = upiLink;
    } else {
      alert("Scan the QR code to complete payment");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
  
      {/* ---------- LEFT SIDE (DELIVERY INFORMATION) ------------- */}
      <div className='flex flex-col gap-4 flex-1 max-w-[50%] px-4'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
  
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='FirstName' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='LastName' />  
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email Address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />  
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />  
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>
  
      {/* ---------RIGHT SIDE (CART TOTAL + PAYMENT METHOD)---------------- */}
      <div className='flex flex-col flex-1 max-w-[50%] px-4'>
        <div className='mt-8 min-w-60'>
          <CartTotal/>
        </div>
  
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>

          {/* Show QR or button based on device */}
          {isMobile ? (
            <button
              type="submit"
              className="bg-green-500 text-white px-5 py-3 text-sm"
            >
              Pay ₹{amount} via UPI
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p>Scan to pay ₹{amount}</p>
              <QRCodeCanvas value={upiLink} size={200} />
              <button
                type="submit"
                className="bg-green-500 text-white px-5 py-3 text-sm"
              >
                I've Paid
              </button>
            </div>
          )}
        </div>
      </div>
  
    </form>
  )
}

export default PlaceOrder
