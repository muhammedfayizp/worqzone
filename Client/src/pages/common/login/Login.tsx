import React, { useState } from 'react';
import { FaUserLock } from "react-icons/fa";
import logimg from '../../../assets/Login.png';
import type { formError, userSignIn, userSignUp } from '../../../interface/Interface';
import { validateForm } from '../../../validations/authValidation';
import { companySignIn } from '../../../services/company/companyApi';

const Login = () => {
  const [formData, setFormData] = useState<userSignIn>({
    email: '',
    role: '',
    password: '',
  })
  const [formError,setFormError]=useState<formError>({
    email: '',
    role: '',
    password: '',
  })
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value.trim() })
  }

  const handleRealTimeValidation=(e:React.FocusEvent<HTMLInputElement|HTMLSelectElement>)=>{
    const {name,value}=e.target
    const {errors}=validateForm(formData,'login')
    console.log("Validation errors:", errors);
    setFormError((prevErrors)=>({
      ...prevErrors,
      [name]:errors[name as keyof formError]||''
    }))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { isValidate, errors } = validateForm(formData, 'login');
    if (isValidate) {
      try {
        if (formData.role=='company') {
          const response = await companySignIn(formData)
        }
      } catch (error) {
        
      }
      
    }else{
      console.log("Validation failed:", errors);
      return;
    }
  }

  return (
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
                type="email"
                name='email'
                placeholder="Email"
                onChange={handleInputChange}
                onBlur={handleRealTimeValidation}
                value={formData.email}
                className="w-full bg-[#1f1c1d] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {formError.email && (
                  <p className="text-red-500 text-sm mt-1">{formError.email}</p>
                )}
            </div>
            <div>
            <input
              type="password"
              name='password'
              onChange={handleInputChange}
              onBlur={handleRealTimeValidation}
              value={formData.password}
              placeholder="Password"
              className="w-full bg-[#1f1c1d] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {formError.password && (
                  <p className="text-red-500 text-sm mt-1">{formError.password}</p>
                )}
            </div>
            <div className='flex justify-between'>
              <div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  onBlur={handleRealTimeValidation}
                  className="bg-[#1f1c1d] w-full px-2 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white/70"
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
              <div className="text-right mt-1 text-sm text-white/70">
                <a href="#" className="hover:underline text-blue-400">Forgot password?</a>
              </div>
            </div>

            <div className='flex justify-center mt-15'>

              <button
                type="submit"
                className="px-10 items-center justify-between bg-[#d8d8d9] text-black font-semibold py-3 rounded-md hover:bg-gray-200/70 transition"
              >
                Login
              </button>
            </div>

            <div className="text-center text-sm text-white/70 mt-4">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-400 hover:underline">Create One</a>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
