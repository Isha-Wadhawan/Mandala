import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios"


const PlaceOrder = () => {


  const { backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, user } = useContext(ShopContext);


  //   let storedUser = null;

  // try {
  //   const rawUser = localStorage.getItem("user");
  //   if (rawUser && rawUser !== "undefined") {
  //     storedUser = JSON.parse(rawUser);
  //   }
  // } catch (err) {
  //   console.error("Corrupted user in localStorage");
  //   localStorage.removeItem("user");
  // }

  // const currentUser = user || storedUser;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }))
  };

  // calculate final amount
  const amount = getCartAmount() + delivery_fee;

  // create dynamic UPI link
  // detect mobile
  const isMobile = /Android|iPhone/i.test(navigator.userAgent);


  // const onSubmitHandler = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   // 1. Safe User Detection
  //   let localUser = null;
  //   const storedData = localStorage.getItem("user");
  //   if (storedData && storedData !== "undefined") {
  //     try {
  //       localUser = JSON.parse(storedData);
  //     } catch (err) {
  //       console.error("User data parse error");
  //     }
  //   }

  //   const activeUser = user || localUser;

  //   if (!activeUser || !activeUser._id) {
  //     toast.error("Please login to place an order");
  //     navigate("/login");
  //     return;
  //   }

  //   // 2. Prepare Order Items
  //   const orderItems = [];
  //   for (const id in cartItems) {
  //     const product = products.find((p) => p._id === id);
  //     if (!product) continue;

  //     for (const size in cartItems[id]) {
  //       const quantity = cartItems[id][size];
  //       if (quantity > 0) {
  //         orderItems.push({
  //           productId: product._id,
  //           name: product.name,
  //           price: product.price,
  //           quantity,
  //           size,
  //           images: product.images,
  //         });
  //       }
  //     }
  //   }

  //   if (orderItems.length === 0) {
  //     toast.error("Your cart is empty");
  //     setLoading(false);
  //     return;
  //   }

  //   // 3. Construct Order Data
  //   const orderData = {
  //     userId: activeUser._id,
  //     items: orderItems,
  //     amount,
  //     address: formData,
  //     paymentMethod: "UPI",
  //     payment: false, // Remains false until you verify manually in Admin
  //   };

  //   try {
  //     // 4. Axios POST Request
  //     const response = await axios.post(
  //       `${backendUrl}/api/order/place`,
  //       orderData,
  //       { headers: { token } }
  //     );

  //     if (response.data.success) {
  //       // Clear cart locally
  //       setCartItems({});
  //       localStorage.removeItem("cartItems");

  //       // Success Message for Manual Verification
  //       toast.success("Order Placed! Verification in progress.");

  //       // Redirect to Orders page
  //       navigate("/orders");
  //     } else {
  //       toast.error(response.data.message || "Order failed");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error.response?.data?.message || "Something went wrong");
  //   }
  //   finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];

      // 1. Convert cartItems object into an array of products (matching your existing logic)
      for (const itemsId in cartItems) {
        for (const size in cartItems[itemsId]) {
          if (cartItems[itemsId][size] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === itemsId));
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemsId][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });

      if (response.data.success) {
        const phoneNumber = "8447326152";
        const itemDetails = orderItems.map(item => `${item.name} (${item.size}) x${item.quantity}`).join('\n');

        const message = `*New Order Alert!* 🎨\n\n` +
          `*Items:*\n${itemDetails}\n\n` +
          `*Total Amount:* ₹${orderData.amount}\n\n` +
          `*Shipping Address:*\n` +
          `${formData.firstName} ${formData.lastName}\n` +
          `${formData.street}, ${formData.city}, ${formData.state}\n` +
          `Phone: ${formData.phone}\n\n` +
          `*Please share UPI details for payment!*`;

        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');

        // 6. Finalize
        setCartItems({});
        navigate('/orders');
        toast.success("Order record created! Redirecting to WhatsApp...");
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }



  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

      {/* ---------- LEFT SIDE (DELIVERY INFORMATION) ------------- */}
      <div className='flex flex-col gap-4 flex-1 max-w-[50%] px-4'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
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
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          {/* Show QR or button based on device */}
          {isMobile ? (
            <button
              type="submit"
              disabled={loading}
              className={`bg-green-500 text-white px-5 py-3 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Placing Order..." : `Pay ₹${amount} via UPI`}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p>TOTAL AMOUNT ₹{amount}</p>
              <span className='text-sm text-red-600 '>Click below to place your order and view the payment QR code.</span>

              <button
                type='submit'
                className='bg-[#25D366] text-white px-16 py-3 text-sm active:bg-green-700 rounded-sm flex items-center justify-center gap-2'
              >
                PLACE ORDER VIA WHATSAPP
              </button>
            </div>
          )}
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder
