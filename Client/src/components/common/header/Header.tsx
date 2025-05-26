import React from 'react'
import logo from '../../../assets/mainlogo.png'

const Header = () => {
  return (
    <div>
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button className="text-2xl text-gray-400">☰</button>
            <button className="text-xl">👤</button>
          </div>

          {/* Logo Image */}
          <img
            src={`${logo}`}
            alt="Worqzone Logo"
            className="h-20 object-contain"
          />
        </header>
    </div>
  )
}

export default Header