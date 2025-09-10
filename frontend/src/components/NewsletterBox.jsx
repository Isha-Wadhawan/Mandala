import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe Now and get 10% off </p>
        <p className='text-gray-400 mt-3'> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta laboriosam, fugit pariatur nemo, eos velit, ipsum id in ea perspiciatis veniam. Id eveniet modi repellat ut cum aperiam vitae hic.</p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
            <input className='w-full sm:flex-1 text-center outline-none' type='email' placeholder='Enter your email' required/>
            <button type='submit' className='bg-black text-white text-xs px-5 py-3'>SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsletterBox

