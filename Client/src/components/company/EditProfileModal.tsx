import React, { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import type { editProfileForm,editProfileError } from '../../interface/Interface'
import { getCompanyProfile, updateProfile } from '../../services/company/companyApi'
import { toast } from 'react-toastify'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    companyData: {
        companyName: string,
        email: string,
        phone: string,
        industry: string,
        profileImage: string
    };
    onProfileUpdated: () => void;
}

const EditProfileModal: React.FC<Props> = ({ isOpen, onClose, companyData,onProfileUpdated }) => {
    if (!isOpen) return null

    const [formData, setFormData] = useState<editProfileForm>({
        companyName: '',
        email: '',
        phone: '',
        industry: '',
        profileImage:new File([], ''),
    })

    const [formError,setFormError]=useState<editProfileError>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target as HTMLInputElement
        console.log(files);

        if (name === 'profileImage' && files && files.length > 0) {
            setFormData({ ...formData, [name] : files[0] })      
                  
        }else{
            setFormData({ ...formData, [name]: value.trim() })
        }
    }

    const validateForm=()=>{
        const errors:editProfileError= {};
        if(!formData.companyName.trim())errors.companyName='company name is required'
        if(!formData.email.trim())errors.email='email is required'
        if(!formData.industry.trim())errors.industry='industry is required'
        if(!formData.phone.trim())errors.phone='phone number is required'

        return errors
    }
    const handleRealTimeValidation=(e:React.FocusEvent<HTMLInputElement|HTMLSelectElement>)=>{
        const {name}=e.target
        const errors=validateForm()
        setFormError((prevErrors)=>({
            ...prevErrors,
            [name]: errors[name as keyof editProfileError]||''
        }))
    }

    useEffect(()=>{
        if(isOpen&&companyData){
            setFormData({
                companyName:companyData.companyName,
                email:companyData.email,
                phone:companyData.phone,
                industry:companyData.industry,
                profileImage:new File([],'')
            })
        }
    },[isOpen,companyData])
   

    const handleSubmit= async (e:React.FormEvent)=>{
        e.preventDefault()

        const errors=validateForm()
        setFormError(errors)
        
        if(Object.keys(errors).length===0){
            console.log("submiting ",formData);
            const response=await updateProfile(formData)

            if (response.success) {
                toast.success(response.message)
                onClose();
                onProfileUpdated()
            }else{
                toast.error(response.message||'Profile updation failed')
            }
            
        }else{
            console.log('form has errors',errors);
        }
    }

    return (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 ">
            <div className="card rounded-lg p-6 w-11/12 max-w-md text-gray-300 relative">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

                <form className="space-y-4 " onSubmit={handleSubmit}>

                    <div className="flex justify-center py-4">
                        {companyData && (
                            <div className="relative flex-shrink-0 cursor-pointer group">
                                <input
                                    type="file"
                                    hidden
                                    name="profileImage"
                                    accept=".jpg,.png"
                                    onChange={handleInputChange}
                                    id="profileImageInput"
                                />

                                <label htmlFor="profileImageInput">
                                    {formData.profileImage && formData.profileImage.size > 0 ? (
                                        <img
                                            src={URL.createObjectURL(formData.profileImage)}
                                            alt="Uploaded profile"
                                            className="w-32 h-32 sm:w-36 sm:h-36 md:w-35 md:h-35 rounded-full"
                                        />
                                    ) : companyData.profileImage ? (
                                        <img
                                            src={companyData.profileImage}
                                            alt="Profile image"
                                            className="w-32 h-32 sm:w-36 sm:h-36 md:w-35 md:h-35 rounded-full shadow-md"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-35 md:h-35 bg-gray-300 rounded-full flex items-center justify-center shadow-md">
                                            <FaUser className="profileImg text-gray-500 text-5xl md:text-6xl" />
                                        </div>
                                    )}

                                </label>
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="">Company Name</label>
                        <input
                            type="text"
                            name='companyName'
                            onChange={handleInputChange}
                            onBlur={handleRealTimeValidation}
                            defaultValue={companyData.companyName}
                            className="w-full p-2 border rounded"
                            placeholder="Company Name"
                        />
                        {formError.companyName && (
                            <p className="text-red-500 text-sm mt-1">{formError.companyName}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="">Email</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={companyData.email}
                            onChange={handleInputChange}
                            onBlur={handleRealTimeValidation}
                            className="w-full p-2 border rounded"
                            placeholder="Email"
                        />
                        {formError.email && (
                            <p className="text-red-500 text-sm mt-1">{formError.email}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="">Phone</label>
                        <input
                            type="text"
                            name='phone'
                            defaultValue={companyData.phone}
                            onChange={handleInputChange}
                            onBlur={handleRealTimeValidation}
                            className="w-full p-2 border rounded"
                            placeholder="Phone"
                        />
                        {formError.phone && (
                            <p className="text-red-500 text-sm mt-1">{formError.phone}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="">Industry</label>
                        <input
                        type="text"
                        id="industry"
                        name="industry"
                        list="industries"
                        defaultValue={companyData.industry}
                        onChange={handleInputChange}
                        onBlur={handleRealTimeValidation}
                        placeholder="e.g., IT, Healthcare"
                        className="w-full  w-full p-2 border rounded"
                        required
                        />
                        <datalist id="industries">
                        <option value="IT" />
                        <option value="Healthcare" />
                        <option value="Finance" />
                        <option value="Education" />
                        <option value="Retail" />
                        <option value="Manufacturing" />
                        <option value="Transportation" />
                        <option value="Media" />
                        <option value="Real Estate" />
                        </datalist>
                        {formError.industry && (
                            <p className="text-red-500 text-sm mt-1">{formError.industry}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-400 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default EditProfileModal