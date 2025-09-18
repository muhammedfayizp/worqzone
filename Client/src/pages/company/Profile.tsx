import React, { useEffect, useState } from 'react';
import Header from '../../components/common/header/Header';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import Footer from '../../components/common/footer/Footer';
import { logout } from '../../redux/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import { companyLogout, getCompanyProfile } from '../../services/company/companyApi';
import { FaUser } from 'react-icons/fa';
import EditProfileModal from '../../components/company/EditProfileModal';
import { toast } from 'react-toastify';


interface CompanyData {
  companyName: string,
  email: string,
  phone: string,
  profileImage: string,
  industry: string
}

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const role = useSelector((state: RootState) => state.auth.role);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLogout = async() => {
    try {
      const response=await companyLogout()
      dispatch(logout())
      toast.success(response.message)
      navigate('/login')
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong during logout");

    }
  }


  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  
  const getProfileData = async () => {
    try {
      const response = await getCompanyProfile()

      if (response.success) {
        setCompanyData(response.companyData)
      }

    } catch (error) {
      console.log('Failed to fetch user details', error);

    }
  }
  useEffect(() => {
    getProfileData()
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isModalOpen]);


  return (
    <div className="bg-card p-6 shadow-lg w-full max-w-12/12 ">

      {/* Top Navbar */}
      <Header />

      {/* Main Content */}
      <main className="px-6 py-8 space-y-8">
      <div className={`transition-all duration-200 ${isModalOpen ? 'blur-sm ' : ''}`}>
          <div className='card rounded-xl p-10 w-12/14 text-white mx-auto'>
            <div className="p-6 rounded-lg flex flex-col gap-6">

              <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-6">
                {/* Left: Profile Info */}
                <div className="flex-1 pl-10">
                  <h2 className="text-4xl font-semibold">👤 Profile</h2>
                  <p className="text-lg mt-4">
                    Here's your account info and settings overview.
                  </p>

                  <div className="mt-6 space-y-2 text-white/80">
                    {companyData && (
                      <>
                        <p><strong>Role:</strong> {role}</p>
                        <p><strong>Company Name:</strong> {companyData.companyName}</p>
                        <p><strong>Email:</strong> {companyData.email}</p>
                        <p><strong>Phone:</strong> {companyData.phone}</p>
                        <p><strong>Industry:</strong> {companyData.industry}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Avatar or Image */}
                {companyData && (
                  <div className="flex-shrink-0">
                    {companyData.profileImage ? (
                      <img
                        src={companyData.profileImage}
                        alt="user-avatar"
                        className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-gray-300 rounded-full flex items-center justify-center shadow-md">
                        <FaUser className="text-gray-500 text-5xl md:text-6xl" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-5 ml-10">
                <button onClick={() => setModalOpen(true)} className="bg-[#2d2a5d] hover:bg-blue-600 text-white px-6 py-4 rounded-lg">
                  Edit Profile
                </button>
                <button onClick={handleLogout} className="bg-[#2d2a5d] hover:bg-red-600 text-white px-6 py-4 rounded-lg" >
                  Logout
                </button>
              </div>
              
            </div>
          </div>
        </div>
        {companyData && isModalOpen && (
          <EditProfileModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            companyData={companyData}
            onProfileUpdated={getProfileData}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;


