import React from 'react'
import { FaVideo, FaComments, FaTasks, FaFileAlt, FaUserPlus, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import homeimg from '../../../assets/Homeimg1.png'
import './Home.css'
import Footer from '../../../components/common/footer/footer'
import Header from '../../../components/common/header/header';

const Home = () => {
  return (
    
      <div className="bg-card p-6 shadow-lg w-full max-w-12/12">

        {/*  Top Navbar */}
        <Header/>

        {/* Main Content */}
        <main className="px-6 py-8 space-y-8">
          <div className='card rounded-xl p-10 w-full  text-white'>
            <div className="p-6 rounded-lg flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-6">
                <div className="flex-1 pl-5">
                  <h2 className="text-5xl font-semibold">welcome to virtual office</h2>
                  <p className="text-xl mt-25">
                    if you want to create workspace,<br /> you can purchase our subscription<br/> packages
                  </p>
                </div>

                {/* Right: Image */}
                <div>
                  <img
                    src={`${homeimg}`}
                    alt="virtual"
                    className="w-50 lg:w-60"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-15 ml-10">
                <button className="bg-[#2d2a5d] hover:bg-blue-600 text-white px-8 py-5 rounded-lg flex items-center gap-3">
                  <FaVideo /> Start Video Call
                </button>
                <button className="bg-[#2d2a5d] hover:bg-blue-600 text-white px-8 py-5 rounded-lg flex items-center gap-3">
                  <FaComments /> Open Chat
                </button>
                <button className="bg-[#2d2a5d] hover:bg-blue-600 text-white px-8 py-5 rounded-lg flex items-center gap-3">
                  <FaTasks /> View Tasks
                </button>
                <button className="bg-[#2d2a5d] hover:bg-blue-600 text-white px-8 py-5 rounded-lg flex items-center gap-3">
                  <FaFileAlt /> Documents
                </button>
              </div>
            </div>
          </div>
          
          {/* Cards Row */}
          <div className="flex flex-col md:flex-row gap-4">

            {/* Upcoming Meetings */}
            <div className="bg-[#12152e] text-white rounded-xl p-4 w-full md:w-1/2 flex flex-col items-start justify-between h-70">
              <div>
                <h3 className="text-xl font-semibold mb-3">Upcoming Meetings</h3>
                <div className="flex flex-col text-sm text-white/80">
                  <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center w-14 h-14">
                    <FaCalendarAlt className="text-white text-2xl" />
                  </div>
                  <span>No upcoming meetings</span>
                </div>
              </div>
              <button className="mt-4 bg-[#2d2a5d] hover:bg-blue-700 text-white px-7 py-4 text-sm rounded-md">
                Add meeting
              </button>
            </div>

            {/* Team Members Card */}
            <div className="bg-[#12152e] text-white rounded-xl p-4 w-full md:w-1/2 flex flex-col items-start justify-between h-60">
              <div className="w-full">
                <h3 className="text-xl font-semibold mb-3">Team Members</h3>
                <div className="flex gap-1 mb-2">
                <FaUserPlus /> 
                  {/* <img src="https://i.pravatar.cc/30?img=1" alt="user1" className="rounded-full w-8 h-8" />
                  <img src="https://i.pravatar.cc/30?img=2" alt="user2" className="rounded-full w-8 h-8" />
                  <img src="https://i.pravatar.cc/30?img=3" alt="user3" className="rounded-full w-8 h-8" />
                  <img src="https://i.pravatar.cc/30?img=4" alt="user4" className="rounded-full w-8 h-8" />
                  <div className="bg-[#2d2a5d] text-xs w-8 h-8 flex items-center justify-center rounded-full">+3</div> */}
                </div>
              </div>
              <button className="mt-4 bg-[#2d2a5d] hover:bg-blue-700 text-white px-7 py-4 flex items-center text-sm rounded-md gap-2">
                <FaUserPlus /> Add Members
              </button>
            </div>
          </div>


          {/* Task Section */}
          <div className="bg-[#12152e] text-white rounded-xl p-4 h-40">
            <h3 className="text-lg font-semibold mb-3">Your Tasks</h3>
            <div className="flex items-center gap-2 bg-[#1c1f3a] rounded-lg px-3 py-2">
              <span className="text-blue-400 text-sm">✏️</span>
              <input
                type="text"
                placeholder="Add a new task..."
                className="bg-transparent text-sm text-white placeholder-white/70 outline-none flex-1"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md">
                <FaPlus />
              </button>
            </div>
          </div>

        </main>
        {/* footer */}
        <Footer/>
        
      </div>
  )
}

export default Home