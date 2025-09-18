import React, { useState } from 'react';
import Header from '../../components/common/header/Header';
import Footer from '../../components/common/footer/Footer';
import meet from '../../assets/meet.png'
import { Fa0, FaMicrophone } from 'react-icons/fa6';
import { FaVideo } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
  const role = useSelector((state: RootState) => state.auth.role)
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [isCopied, setIsCopied] = useState(false);
  const [meetingType, setMeetingType] = useState<'video' | 'audio' | null>(null)
  const [userEmail, setUserName] = useState('')
  const [joinRoomCode, setJoinRoomCode] = useState('')

  const [nameError, setNameError] = useState<string | null>(null);
  const [roomCodeError, setRoomCodeError] = useState<string | null>(null);



  const navigate=useNavigate()

  const handleCreateRoom = () => {
    if (!userEmail.trim()) {
      setNameError('Please enter your email.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      setNameError('Please enter a valid email address.');
      return;
    }

    setNameError(null);
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase()
    setRoomCode(randomCode)
    setIsCreatingRoom(true)
    setMeetingType(null)
    navigator.clipboard.writeText(randomCode)
  }

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handelSelectMeetingType = (type: 'video' | 'audio') => {
    setMeetingType(type)
  }

  const handleStartMeeting = ()=>{
    if(!meetingType){
      toast.error("Please select a meeting type first.")
      return
    }

    const meetingData={
      email:userEmail.trim(),
      roomCode:roomCode.trim(),
      meetingType,
      isAdmin: true,
    }

    navigate(`/meetRoom/${roomCode}`, { state: meetingData });

    
  }

  const handleJoinRoom = () => {    
    let hasError = false;

    if (!userEmail.trim()) {
      setNameError('Please enter your email.');
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail.trim())) {
        setNameError('Please enter a valid email address.');
        hasError = true;
      } else {
        setNameError(null);
      }
    }

    if (!joinRoomCode.trim()) {
      setRoomCodeError('Please enter a valid room code.');
      hasError = true;
    } else {
      setRoomCodeError(null);
    }

    if (hasError) return;


    // Navigation logic here
    const joinUserData={
      email:userEmail.trim(),
      joinRoomCode:joinRoomCode.trim(),
      isAdmin: false,
    }
    console.log(joinUserData);
    
    
    navigate(`/meetRoomjoin/${joinRoomCode}`, { state: joinUserData });


  };

  return (
    <div className="bg-card min-h-screen p-6 w-full text-white flex flex-col">
      <Header />

      <main className='flex-grow flex items-center justify-center px-4 py-10 transition-all '>
        <section className="card flex flex-col lg:flex-row items-center justify-between bg-green-200 p-10 rounded-2xl shadow-xl w-full max-w-7xl">
          <div className="text-center lg:text-left max-w-xl">
            <img
              src={meet}
              alt="meetings"
              className="mx-auto lg:mx-0 mb-10 w-85"
            />
            <h1 className="text-3xl font-extrabold text-white mb-10">
              Stay connected with your clients, employees, no matter where you are.
            </h1>
            <p className="text-lg text-gray-300">
              Step into your digital workspace—where focus meets your team. Connect, co-work, and crush your goals with others who get it.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d2a5d] to-[#3f3c77] rounded-2xl shadow-2xl p-10 mt-10 lg:mt-0 lg:ml-10 w-full max-w-sm text-center transition-transform duration-300 hover:scale-[1.02]">
            <h2 className="text-3xl font-extrabold text-white mb-10 tracking-wide">
              Start Connecting
            </h2>

            <div>
              <input
                type="text"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setNameError(null);
                }}
                className="w-full mb-2 px-4 py-2 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {nameError && (
                <p className="text-red-500 text-sm mb-2 font-semibold">{nameError}</p>
              )}
            </div>
            {!isCreatingRoom && (
              <div>
                <input
                  type="text"
                  placeholder="Enter the Room Code"
                  value={joinRoomCode}
                  onChange={(e) => {
                    setJoinRoomCode(e.target.value);
                    setRoomCodeError(null);
                  }}
                  className="w-full mb-2 px-4 py-2 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {roomCodeError && (
                  <p className="text-red-500 text-sm mb-2 font-semibold">{roomCodeError}</p>
                )}
              </div>
            )}
            {isCreatingRoom && (
              <>
                <div className="relative w-full mb-4">
                  <div
                    className={`flex items-center justify-between w-full px-3 py-1 rounded-xl border transition-colors duration-300 ${isCopied ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
                      }`}
                  >
                    <input
                      type="text"
                      value={roomCode}
                      readOnly
                      className="bg-transparent w-full text-center font-semibold tracking-wide text-gray-800 focus:outline-none"
                    />

                    <span
                      onClick={handleCopyRoomCode}
                      className={`ml-4 text-sm font-medium cursor-pointer transition-colors ${isCopied ? 'text-blue-700' : 'text-green-600 hover:text-green-700'
                        }`}
                    >
                      {isCopied ? 'Copied!' : 'Copy'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    onClick={() => handelSelectMeetingType('video')}
                    className={`flex-1 border rounded-lg p-2 cursor-pointer transition ${meetingType === 'video'
                        ? 'border-green-500 bg-[#161434]'
                        : 'border-green-100 hover:bg-[#1e1d3b]'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-1 rounded-lg">
                        <FaVideo className="text-gray-700 text-md" />
                      </div>
                      <h3 className="text-sm font-semibold">Video Room</h3>
                    </div>
                  </div>

                  <div
                    onClick={() => handelSelectMeetingType('audio')}
                    className={`flex-1 border rounded-lg p-2 cursor-pointer transition ${meetingType === 'audio'
                        ? 'border-green-500 bg-[#161434]'
                        : 'border-green-100 hover:bg-[#1e1d3b]'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-1 rounded-lg">
                        <FaMicrophone className="text-gray-700 text-md" />
                      </div>
                      <h3 className="text-sm font-semibold">Audio Room</h3>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
              {role == 'company' && (
                <>
                  {!isCreatingRoom ? (
                    <>
                      <button
                        onClick={handleCreateRoom}
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-3 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
                      >
                        <span className="text-lg">➕</span>
                        <span>Create Room</span>
                      </button>

                      <button
                        onClick={handleJoinRoom}
                        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
                      >
                        <FaVideo className="text-lg" />
                        <span>Join Room</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleStartMeeting}
                      className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-2 py-2 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
                    >
                      <span className="text-lg">➕</span>
                      <span>Start Meeting</span>
                    </button>
                  )}


                </>

              )}
              {role == 'employee' && (
                <>
                  {/* <button className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-3 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
                    <span className="text-lg">➕</span>
                    <span>Create Room</span>
                  </button> */}
                  <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
                    <FaVideo className="text-lg" />
                    <span>Join Room</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CreateRoom;
