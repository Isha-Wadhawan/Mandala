import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.get(backendUrl + '/api/order/list', { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: e.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status")
    }
  }

  const safeText = (val) => {
    if (val === null || val === undefined) return "";

    // If it's a primitive (string, number), return it
    if (typeof val !== 'object') return String(val);

    // If it's an object (like {A2}), try to get the first value
    const values = Object.values(val);
    if (values.length > 0) {
      // If the value inside is ANOTHER object, stringify it, otherwise return it
      return typeof values[0] === 'object' ? JSON.stringify(values[0]) : String(values[0]);
    }

    // Fallback for empty objects
    return JSON.stringify(val);
  }

  const paymentHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, payment: e.target.value === "Paid" },
        { headers: { token } }
      )
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  // Helper to safely render potential objects
  const safeRender = (value) => {
    if (value === null || value === undefined) return "";
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }


  return (
    <div className='p-5'>
      <h3 className='text-xl font-bold mb-4'>Order Page</h3>

      <div>
        {orders.map((order, index) => (
          <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'>
            <img className='w-12' src={assets.parcel_icon} alt="" />

            <div>
              <div>
                {order.items.map((item, i) => {
                  // HELPER: If quantity is an object like {A2: 1}, extract the 1.
                  const cleanQuantity = typeof item.quantity === 'object'
                    ? Object.values(item.quantity)[0]
                    : item.quantity;

                  return (
                    <p className='py-0.5' key={i}>
                      {item.name} x {cleanQuantity} <span>{item.size}</span>
                      {i !== order.items.length - 1 && ","}
                    </p>
                  );
                })}
              </div>

              {/* Address section - using String() just in case firstName is also an object */}
              <p className='mt-3 mb-2 font-medium'>
                {String(order.address?.firstName || "")} {String(order.address?.lastName || "")}
              </p>
              <div>
                <p>{String(order.address?.street || "") + ","}</p>
                <p>{`${String(order.address?.city || "")}, ${String(order.address?.state || "")}, ${String(order.address?.zipcode || "")}`}</p>
              </div>
              <p>{String(order.address?.phone || "")}</p>
            </div>

            <div>
              <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
              <div className='mt-2'>
                <p className='mb-1 text-gray-500'>Payment Status:</p>
                <select 
                  onChange={(e) => paymentHandler(e, order._id)}
                  value={order.payment ? "Paid" : "Pending"}
                  className={`p-1.5 border rounded outline-none font-medium ${order.payment ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <p className='mt-3'>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>

            <select
              onChange={(e) => statusHandler(e, order._id)}
              value={order.status}
              className='p-2 font-semibold border border-gray-300 rounded'
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
    </div>
    </div >
  )
}
export default Orders