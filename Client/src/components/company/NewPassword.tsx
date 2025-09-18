import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { companyNewPasswordSet } from '../../services/company/companyApi';


const NewPassword = () => {
    const navigate = useNavigate()
    const location=useLocation()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const [errors, setErrors] = useState<{ newPassword?: string, confirmPassword?: string }>({})

    const handleSubmit = async() => {
        const {email,role}=location.state||{}
        const validationError: { newPassword?: string, confirmPassword?: string } = {}

        if (!newPassword || newPassword.length < 8) {
            validationError.newPassword = 'Password must be at least 8 characters long.'
        }
        if (newPassword !== confirmPassword) {
            validationError.confirmPassword = 'Password do not match'
        } else if (!confirmPassword || confirmPassword.length < 8) {
            validationError.confirmPassword = 'Password must be at least 8 characters long.'
        }
        if (Object.keys(validationError).length > 0) {
            setErrors(validationError)
            return
        }
        try {
            if (role=='company') {
                const response=await companyNewPasswordSet(email,newPassword)
                if (response.success) {
                    toast.success(response.message)
                    navigate('/login')
                }
            }
        } catch (error) {
            
        }
    }

    return (
        <div className="bg-card fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="card  p-6 rounded-lg max-w-md w-full text-gray-300">
                <h2 className="text-xl font-bold mb-4">Set New Password</h2>
                <p className="text-sm text-gray-400 mt-4">
                    Make sure your new password is strong and unique to keep your account secure.
                </p>
                <div className="relative w-full mb-3 mt-10">
                    <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="peer w-full px-3 pt-7 pb-2 border border-gray-300 rounded-md placeholder-transparent focus:outline-none"
                        placeholder="New Password"
                    />
                    <label
                        htmlFor="newPassword"
                        className="absolute left-3 top-2 text-gray-500 text-sm transition-all 
                            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
                            peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm"
                    >
                        New Password
                    </label>
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400'
                        onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                    {errors.newPassword && (
                        <p className="text-sm text-red-400 mt-1">{errors.newPassword}</p>
                    )}
                </div>

                <div className="relative w-full mb-3">
                    <input
                        type={showConfirmPass ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="peer w-full px-3 pt-7 pb-2 border border-gray-300 rounded-md placeholder-transparent focus:outline-none"
                        placeholder="Confirm Password"
                    />
                    <label
                        htmlFor="confirmPassword"
                        className="absolute left-3 top-2 text-gray-500 text-sm transition-all 
                            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
                            peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm"
                    >
                        Confirm Password
                    </label>
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400'
                        onClick={() => setShowConfirmPass((prev) => !prev)}
                    >
                        {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>
                    )}
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => navigate('/login')} className="px-4 py-2 bg-gray-500 text-white rounded">
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewPassword