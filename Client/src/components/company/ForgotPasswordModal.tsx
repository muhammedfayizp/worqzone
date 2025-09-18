import React, { useState } from 'react'
import type { formError } from '../../interface/Interface'
import { companyForgotPassEmailSubmit } from '../../services/company/companyApi'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

interface Props{
  isOpen:boolean,
  onClose:()=>void
}

const ForgotPasswordModal:React.FC<Props> = ({isOpen,onClose}) => {
  const navigate=useNavigate()
  const [showHelpPopup, setShowHelpPopup] = useState(false)
  const [email,setEmail]=useState('')
  const [role,setRole]=useState('')
  const [errors,setErrors]=useState<{email?:string,role?:string}>({})

  const validateEmail=(email:string):boolean=>{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleForgotEmailSubmit= async ()=>{
    const validationError:{email?:string,role?:string}={}
    
    if (!email) {
      validationError.email='Email is required'
    }else if(!validateEmail(email)) {
      validationError.email="invalid email format"
    }

    if (!role) {
      validationError.role='Role is required'
    }
    if (Object.keys(validationError).length>0) {
      setErrors(validationError)
      return
    }

    try {
      if (role=='company') {
        const response=await companyForgotPassEmailSubmit(email)

        if (response.success) {
          toast.success(response.message)
          navigate('/otp',{state:{
            email:email,
            role:role,
            otpType:'forgotPassword'
          }})
        }else{
          toast.error(response.message)
        }
      }else{
        toast.info('This role is not supported yet.')
      }

    } catch (error) {
      console.log(error);
      toast.error('internal server error')
    }
  }

  if (!isOpen) return null  
  return (
    <main className="px-6 py-8 space-y-8">

      <div className="fixed inset-0 bg-black/50 flex items-center text-left  justify-center z-50">
        <div className="card p-6 rounded-lg  max-w-md w-full shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-gray-300">Find your account</h2>
          <p className=" mb-1 text-w text-gray-300">Enter your email to reset your password.</p>
          <a className='text-blue-300 mb-4' onClick={() => setShowHelpPopup(true)}>Can't reset your password?</a>
            <div className="relative w-full mb-3 mt-10">
              <input
                type="email"
                id="email"
                name='email'
                onChange={(e)=>setEmail(e.target.value)}
                required
                className="peer w-full px-3 pt-7 pb-2 border border-gray-300 rounded-md placeholder-transparent focus:outline-none"
                placeholder="Enter your email"
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm"
              >
                Enter your email
              </label>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div className="relative w-full mb-3 mt-4">
              <select
                id="role"
                name="role"
                onChange={(e)=>setRole(e.target.value)}
                required
                className=" w-full px-3 py-4 border border-gray-300 text-gray-300 rounded-md text-black/80 bg-transparent  "
              >
                <option value="" disabled selected hidden>Select Role</option>
                <option value="admin" className="bg-[#1e1e1e] text-gray-400">Admin</option>
                <option value="company" className="bg-[#1e1e1e] text-gray-400">Company</option>
                <option value="employee" className="bg-[#1e1e1e] text-gray-400">Employee</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500 mt-1">{errors.role}</p>
              )}
            </div>
          <p className='text-gray-400 mt-4'>You may recrive Email notification from us for security and login purposes.</p>
          <div className="flex justify-end gap-3 mt-10">
            <button
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleForgotEmailSubmit}
            >
              Sumbit
            </button>
          </div>
          {showHelpPopup && (
            <div className="absolute top-4 right-4 bg-blue-100 border border-blue-300 text-sm text-blue-900 px-4 py-2 rounded shadow-lg z-10">
              <h1 className='text-xl mb-3'><strong> To help you find your account, we need more info</strong></h1>
              <p>Enter your email address so that we can use a secure<br/> process to help you get back in</p>
              <button
                onClick={() => setShowHelpPopup(false)}
                className="block ml-auto mt-2 text-lg text-red-700 hover:underline "
              >
              <strong> Close</strong>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ForgotPasswordModal