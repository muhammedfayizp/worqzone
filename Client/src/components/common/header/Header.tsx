import React from 'react'
import logo from '../../../assets/mainlogo.png'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const navigate=useNavigate()
  const isLoggedIn=useSelector((state:RootState)=>state.auth.isloggedIn)
  return (
    <div>
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-4">

            { !isLoggedIn&&(
                <button
                  className="text-xl text-gray-400"
                  onClick={()=>navigate('/register')}
                  >REGISTER-NOW
                </button>
            )}
            { isLoggedIn&&(
                <button
                  className="text-xl"
                  onClick={() => navigate('/profile')}
                  >👤
                </button>
            )}
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

