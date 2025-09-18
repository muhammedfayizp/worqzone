import React, { useEffect, useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import OTPInput from "react-otp-input";
import logimg from "../../../assets/Login.png";
import { useNavigate, useLocation } from "react-router-dom";
import { companyOtpVerify } from "../../../services/company/companyApi";
import { toast } from "react-toastify";
import NewPassword from "../../../components/company/NewPassword";

const Otp: React.FC = () => {
  const [otp, setOtp] = useState("");

  const navigate=useNavigate()
  const location=useLocation();
  const state = location.state as {
    email: string;
    role: string;
    otpType: 'register' | 'forgotPassword';
  }
 
  useEffect(() => {
    if (!state?.email || !state?.role || !state?.otpType) {
      const fallbackRoute = state?.otpType === 'forgotPassword' ? '/forgotPassword' : '/register';
      navigate(fallbackRoute);
    }
  }, [state, navigate]);

  let {email,role,otpType}=location.state||{}
  

  const handleOtpSubmit= async(e:React.FormEvent)=>{
    e.preventDefault()

    const trimmedOtp=otp.trim();
    if (trimmedOtp.length!==6||!/^\d{6}$/.test(trimmedOtp)) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    try {
      if(otpType=='register'){

        if(role==='company'){
          const response=await companyOtpVerify(otp,email)
          toast.success(response.message)
          navigate('/login')

        }
      }else{
        if(role=='company'){
          const response=await companyOtpVerify(otp,email)
          toast.success(response.message)
          navigate('/newPassword',{state:{
            email:email,
            role:role
          }})
        }
      }
    } catch (error) {
     console.log('OTP Error');
     toast.error("Something went wrong. Please try again.");

    }
  }

  return (
    <>

        <div className="bg-card min-h-screen bg-black flex items-center justify-center px-4">
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl p-6">
            <div className="w-full  flex justify-center mb-8 md:mb-0">
              <img
                src={logimg}
                alt="Workspace"
                className="w-[300px] md:w-[400px] lg:w-[500px]"
              />
            </div>
            <div className="bg-[#0a0b0a] p-8 rounded-xl shadow-md text-white/80 max-w-md w-full">
              <div className="flex justify-center mb-6">
                <FaUserCheck className="text-5xl text-blue-400" />
              </div>

              <h2 className="text-2xl font-semibold text-center mb-4">Enter OTP</h2>
              <p className="text-center text-sm mb-6 text-white/60">
                Please enter the 6-digit code sent to your email.
              </p>

              <form className="space-y-6" onSubmit={handleOtpSubmit}>
                <div className="flex flex-wrap justify-center gap-2">
                    <OTPInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        inputStyle={{
                        width: "3rem",
                        height: "3rem",
                        fontSize: "1.5rem",
                        marginLeft:'5px',
                        marginBottom:'25px',
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        textAlign: "center",
                        }}
                        renderInput={(props) => (
                        <input
                            {...props}
                            className="text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        )}
                    />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#d8d8d9] text-black font-semibold py-3 rounded-md hover:bg-gray-200/70 transition"
                  disabled={otp.trim().length !== 6}
                >
                  Verify OTP
                </button>

                <div className="text-center text-sm text-white/70 mt-4">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={() => alert("Resend OTP clicked")}
                    className="text-blue-400 hover:underline"
                  >
                    Resend
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </>
  );
};

export default Otp;
