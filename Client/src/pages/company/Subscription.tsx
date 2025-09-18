import React, { useState } from 'react'
import Header from '../../components/common/header/Header'
import Footer from '../../components/common/footer/Footer'

const Subscription = () => {
    const [selectedPlan,setSelectedPlan]=useState('Quarterly')
    const [borderColor,setBorderColor]=useState('Quarterly')

  return (
    <div className="bg-card p-6 shadow-lg w-full max-w-12/12 ">
        <Header/>
        <div className='card rounded-xl p-10 w-12/14 text-white mx-auto'>
        <div className="flex justify-center my-8 gap-4">
        <button
        onClick={() => {
          setSelectedPlan("Quarterly");
          setBorderColor("Quarterly");
        }}
        
        className={`px-4 py-2 rounded-full font-semibold ${
        selectedPlan === "Quarterly"
            ? "bg-black text-white"
            : "border border-gray-400"
        }`}
    >
        Quarterly
    </button>
        <button
        onClick={() => {
          setSelectedPlan("Annually");
          setBorderColor("Annually");
        }}
        
        className={`px-4 py-2 rounded-full font-semibold ${
        selectedPlan === "Annually"
            ? "bg-black text-white"
            : "border border-gray-400"
        }`}
    >
        Annually
    </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-10 max-w-7xl w-full mx-auto">
        
        {/* Basic */}
        <div 
            onClick={() => setBorderColor('freeTrial')}
            className={`border rounded-xl p-6 flex flex-col items-center shadow cursor-pointer ${
                borderColor === 'freeTrial' ? 'border-yellow-500' : 'border-gray-300'
            }`}
            >
            <h3 className="text-2xl font-bold border-b border-white w-fit pb-1">Free Trial</h3>
            <ul className="text-sm space-y-2 mb-15 mt-10">
              <li>Access to meeting rooms up to 5 times</li>
              <li>Limited access to Focus Lounge</li>
              <li>5 days real-time chat</li>
              <li>Limited file sharing</li>
              <li>Cancel or upgrade anytime</li>
            </ul>
            <div className="text-2xl font-bold text-yellow-500 mb-4 mt-6">
              <span className="text-sm">only </span>
                7-Days <span className="text-sm">free trial</span>
            </div>
            <button className="border border-yellow-500 text-yellow-500 px-6 py-2 rounded-full hover:bg-yellow-900">
                Start Free Trial
            </button>
        </div>

        {/* Unlimited (Highlighted) */}
        <div 
            onClick={() => setBorderColor('Quarterly')}
            className={`border rounded-xl p-6 flex flex-col items-center shadow cursor-pointer ${
                borderColor === 'Quarterly' ? 'border-yellow-500' : 'border-gray-300'
            }`}
            >
          <h3 className="text-2xl font-bold border-b border-white w-fit pb-1">Quarterly</h3>
          <ul className="text-sm space-y-2 mb-15 mt-10">
            <li>Unlimited meeting room bookings</li>
            <li>Unlimited access to Focus Lounge</li>
            <li>Unlimited real-time chat</li>
            <li>Unlimited file sharing</li>
            <li>Limitted invites</li>
            <li>Cancel or upgrade anytime</li>
          </ul>
          <div className="text-2xl font-bold text-yellow-500 mb-4">$29.00 <span className="text-sm">for 6-month</span> </div>
          <button className="border border-yellow-500 text-yellow-500 px-6 py-2 rounded-full hover:bg-yellow-900">Pay Now</button>

        </div>

        {/* Premium */}
        <div 
            onClick={() => setBorderColor('Annually')}
            className={`border rounded-xl p-6 flex flex-col items-center shadow cursor-pointer ${
                borderColor === 'Annually' ? 'border-yellow-500' : 'border-gray-300'
            }`}
            >
          <h3 className="text-2xl font-bold border-b border-white w-fit pb-1">Annually</h3>
          <ul className="text-sm space-y-2 mb-15 mt-10">
            <li>Unlimited meeting room bookings</li>
            <li>Unlimited access to Focus Lounge</li>
            <li>Unlimited real-time chat</li>
            <li>Unlimited file sharing</li>
            <li>Unlimited invites</li>
            <li>Cancel or upgrade anytime</li>

          </ul>
          <div className="text-2xl font-bold text-yellow-500 mb-4">$65.00<span className="text-sm"> save </span>$10.00 </div>
          <button className="border border-yellow-500 text-yellow-500 px-6 py-2 rounded-full hover:bg-yellow-900">Pay Now</button>
        </div>

      </div>        </div>
        <Footer/>
    </div>
  )
}

export default Subscription