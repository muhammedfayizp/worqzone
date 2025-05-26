
import './App.css'

import React from 'react'
import Home from './pages/common/landing/Home'
import Landing from './pages/common/landing/Landing'
import Login from './pages/common/login/Login'
import Register from './pages/common/register/Register'
import Otp from './pages/common/otp/Otp'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { Route, Routes } from 'react-router-dom'


const App = () => {
  return (
    <div>

      <Routes>

        <Route path='/*' element={<Landing/>} />

        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path='/login' element={<Login/>}/>

      </Routes>

      {/* <Home/> */}
      {/* <Login/> */}
      {/* <Register/> */}
      {/* <Landing/> */}
      {/* <Otp/> */}
      <ToastContainer/>
    </div>
  )
}

export default App
