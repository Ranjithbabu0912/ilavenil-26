import React from 'react'
import { paymentRule } from '../assets/assets'

const PaymentGuide = () => {
    return (
        <div className='py-10'>
            <div className='flex flex-col items-center'>
                <h1 className='text-3xl font-bold mb-6 text-primary'>Registration Process</h1>
                <p className='text-gray-500 mb-10'>Follow the simple steps to complete your registration</p>
                <div className='flex flex-col md:flex-row justify-around w-[80%] gap-5'>
                    {paymentRule.map((rule, index) => (
                        <div key={index} className='flex md:flex-col flex-row md:h-auto h-20 w-auto border border-gray-300 items-center md:w-40 bg-white shadow-xl rounded-2xl hover:scale-101 transition' >
                            <div className='flex md:flex-col items-center justify-center md:gap-0 mx-3 gap-3'>
                                <p className='text-xl md:mt-4 flex items-center justify-center bg-blue-300 text-primary w-7 h-7 rounded-full'>{index + 1}</p>
                                <p className='md:text-2xl md:mt-2'>{rule.icon}</p>

                            </div>
                            <div className='flex flex-col md:items-center md:mt-2'>
                                <h1 className='font-bold'>{rule.title}</h1>
                                <p className='text-xs md:text-center md:mt-2 md:mb-5 text-gray-600 md:w-[80%]'>{rule.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PaymentGuide