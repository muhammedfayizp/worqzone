import React from 'react'
import logo from '../../../assets/mainlogo.png'


const Footer = () => {
  return (
    <div>
        {/* Footer */}
        <footer className=" py-10 max-w-5xl mx-auto border-t border-w-10 border-white/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-sm text-gray-300 mt-5">
          <div>
            <h1 className="mb-2">
              <img src={`${logo}`} alt="WORQZONE Logo" className="h-20" />
            </h1>
            <p className='text-base px-5'>
              Bringing teams together, no matter the  distance. <br /> Enabling collaboration, driving  innovation,
              and achieving<br /> success—together.
            </p>
          </div>
          <div className='text-center'>
            <h4 className="text-white text-2xl py-5  font-semibold mb-2">Services</h4>
            <ul className="space-y-1 text-base">
              <li>video conferencing</li>
              <li>Real-time chat</li>
              <li>Team collaboration</li>
            </ul>
          </div>
        </footer>
    </div>
  )
}

export default Footer