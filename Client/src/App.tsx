
import './App.css'

import Home from './pages/common/landing/Home'
import Landing from './pages/common/landing/Landing'
import Login from './pages/common/login/Login'
import Register from './pages/common/register/Register'
import Otp from './pages/common/otp/Otp'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { Route, Routes } from 'react-router-dom'
import Profile from './pages/company/Profile'
import NewPassword from './components/company/NewPassword'
import Subscription from './pages/company/Subscription'
import CreateRoom from './pages/company/CreateRoom'
import Meet from './pages/company/Meet'


const App = () => {
  return (
    <div>

      <Routes>

        <Route path='/*' element={<Landing/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/newPassword' element={<NewPassword/>}></Route>
        <Route path='/subscription' element={<Subscription/>}></Route>
        <Route path='/createRoom' element={<CreateRoom/>}></Route>
        <Route path='/meetRoom/:roomCode' element={<Meet/>}></Route>
        <Route path='/meetRoomjoin/:roomCode' element={<Meet/>}></Route>

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
