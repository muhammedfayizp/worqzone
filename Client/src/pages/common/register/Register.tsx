import React, { useState } from 'react'
import { FaUserLock } from "react-icons/fa";
import logimg from '../../../assets/Login.png';
import type { formError, userSignUp } from '../../../interface/Interface';
import { validateForm } from '../../../validations/authValidation';
import { companySignUp } from '../../../services/company/companyApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate=useNavigate()
  
  const [formData, setFormData] = useState <userSignUp>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: ''
  })

  const [formError,setFormError]=useState <formError> ({
    name:'',
    email:'',
    phone:'',
    role:'',
    password:'',
    confirmPassword:''
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement| HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({...formData,[name]:value.trim()})
  }

  //real time validation
  const handleRealTimeValidation = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const { errors } = validateForm(formData, 'register');
    setFormError((prevErrors) => ({
      ...prevErrors,
      [name]: errors[name as keyof formError] || ''
    }));
  };



  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    
    
    const {isValidate,errors} = validateForm(formData,'register')
    console.log(formData.role);
    
    setFormError(errors)
    setIsLoading(true)

    if (isValidate) {
      try {
        if (formData.role==='company') {
          
          const response:any= await companySignUp(formData)
          
          if (response.success) {
            toast.success(response.message)
            navigate('/otp', { state: {
              email: formData.email ,
              role: formData.role
            }})
            setIsLoading(false)
          }else {
            toast.error(response.message || 'Registration failed');
          }
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      } 
    }
    

  }

  return (
    <div>
      <div className="bg-card min-h-screen bg-black flex items-center justify-center px-4">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl p-6">

          {/* Left Image Section */}
          <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
            <img
              src={logimg}
              alt="Workspace"
              className="w-[300px] md:w-[400px] lg:w-[500px]"
            />
          </div>

          {/* Right Form Section */}
          <div className="w-full md:w-1/2 bg-[#0a0b0a] p-8 rounded-xl shadow-md text-white/80">
            <div className="flex justify-center mb-6">
              <FaUserLock className="text-5xl" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleRealTimeValidation}
                  placeholder="Name"
                  className="w-full bg-[#1f1c1d] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {formError.name && (
                  <p className="text-red-500 text-sm mt-1">{formError.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleRealTimeValidation}
                  placeholder="Email"
                  className="w-full bg-[#1f1c1d] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {formError.email && (
                  <p className="text-red-500 text-sm mt-1">{formError.email}</p>
                )}
              </div>

              <div className="flex gap-4">
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleRealTimeValidation}
                  placeholder="Phone"
                  className="w-1/2 bg-[#1f1c1d] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {formError.phone && (
                  <p className="text-red-500 text-sm mt-1">{formError.phone}</p>
                )}

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  onBlur={handleRealTimeValidation}
                  className="w-1/2 bg-[#1f1c1d] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white/70"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="company">Company</option>
                  <option value="employee">Employee</option>
                </select>
                {formError.role && (
                  <p className="text-red-500 text-sm mt-1">{formError.role}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleRealTimeValidation}
                  placeholder="Password"
                  className="w-full bg-[#1f1c1d] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {formError.password && (
                  <p className="text-red-500 text-sm mt-1">{formError.password}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleRealTimeValidation}
                  placeholder="Confirm Password"
                  className="w-full bg-[#1f1c1d] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {formError.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{formError.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-white/70">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-blue-500" />
                  <span>Remember me</span>
                </label>
              </div>

              <div className="flex justify-center mt-15">
                <button
                  type="submit"
                  className="px-10 items-center justify-between bg-[#d8d8d9] text-black font-semibold py-3 rounded-md hover:bg-gray-200/70 transition"
                >
                  Register
                </button>
              </div>

              <div className="text-center text-sm text-white/70 mt-4">
                Already have an account?{" "}
                <a href="/login" className="text-blue-400 hover:underline">Login</a>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register