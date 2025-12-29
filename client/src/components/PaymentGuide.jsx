import React from 'react'
import { paymentRule } from '../assets/assets'

const PaymentGuide = () => {
    return (
        <div className="py-16">
            <div className="max-w-5xl mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-14">
                    <h1 className="text-3xl font-bold text-primary mb-3">
                        Registration Process
                    </h1>
                    <p className="text-gray-500">
                        Follow the simple steps to complete your registration
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Center line */}
                    <div className="hidden md:block absolute left-1/2 top-0 h-full w-1 bg-gray-300 -translate-x-1/2"></div>

                    {paymentRule.map((rule, index) => {
                        const isLeft = index % 2 === 0

                        return (
                            <div
                                key={index}
                                className={`relative flex flex-col md:flex-row items-center mb-12 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
                            >
                                {/* Step Card */}
                                <div
                                    className={`bg-white shadow-xl rounded-2xl border border-gray-200 p-5 w-full md:w-[42%] hover:scale-110 transition ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Step Number */}
                                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white font-bold">
                                            {index + 1}
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-2xl">{rule.icon}</span>
                                                <h2 className="font-bold text-lg">{rule.title}</h2>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {rule.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dot on center line */}
                                <div className="hidden md:block absolute left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2"></div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PaymentGuide
