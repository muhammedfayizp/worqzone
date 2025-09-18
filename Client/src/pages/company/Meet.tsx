
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LocalStream from "../../components/company/mediasoup/LocalStream";
import RemoteStream from "../../components/company/mediasoup/RemoteStream";
import { useMediasoup } from "../../hooks/useMediasoup";
import { useEffect, useMemo, useState } from "react";
import Header from "../../components/common/header/Header";
import {
  FaChevronDown,
  FaComments,
  FaMicrophoneAlt,
  FaMicrophoneAltSlash,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { FaMicrophoneLinesSlash, FaVideo, FaVideoSlash } from "react-icons/fa6";

const Meet = () => {
  const { roomCode } = useParams();
  const { state } = useLocation();
  const { email, meetingType: initialMeetingType, isAdmin } = state || {};

  const {
    localStream,
    remoteStreams,
    meetingType: serverMeetingType,
    softLeave,
    hardLeave,
    micStatus,
  } = useMediasoup(roomCode!, initialMeetingType, Boolean(isAdmin));

  const [showParticipants, setShowParticipants] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMicOn, setIsMicOn] = useState<boolean>(() => {
    const saved = localStorage.getItem("micState");
    return saved === null ? true : JSON.parse(saved);
  });
  const [isVideoOn, setIsVideoOn] = useState<boolean>(() => {
    const saved = localStorage.getItem("videoState");
    return saved === null ? true : JSON.parse(saved);
  });
  const [showRejoinPopup, setShowRejoinPopup] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const navigate = useNavigate();

  const filteredRemoteStreams = useMemo(
    () => remoteStreams.filter((r) => r.stream.getTracks().length > 0),
    [remoteStreams]
  );

  type Participant = {
    id: string;
    stream: MediaStream;
    isLocal: boolean;
    isMicOn: boolean;
  };

  const participants: Participant[] = [
    ...(localStream ? [{ id: "local", stream: localStream, isLocal: true, isMicOn }] : []),
    ...filteredRemoteStreams.map((r) => ({
      id: r.id,
      stream: r.stream,
      isLocal: false,
      isMicOn: r.isMicOn ?? true,
    })),
  ];

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count === 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    if (count <= 12) return "grid-cols-4";
    return "grid-cols-4";
  };

  const toggleMic = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((track) => {
      const newState = !track.enabled;
      track.enabled = newState;
      setIsMicOn(newState);
      localStorage.setItem("micState", JSON.stringify(newState));
      micStatus(newState);
    });
  };

  const toggleVideo = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((track) => {
      const newState = !track.enabled;
      track.enabled = newState;
      setIsVideoOn(newState);
      localStorage.setItem("videoState", JSON.stringify(newState));
    });
  };

  useEffect(() => {
    if (!localStream) return;

    const savedMicState = localStorage.getItem("micState");
    const savedVideoState = localStorage.getItem("videoState");

    if (savedMicState !== null) {
      const micOn = JSON.parse(savedMicState);
      localStream.getAudioTracks().forEach((t) => (t.enabled = micOn));
      setIsMicOn(micOn);
    }
    if (savedVideoState !== null) {
      const videoOn = JSON.parse(savedVideoState);
      localStream.getVideoTracks().forEach((t) => (t.enabled = videoOn));
      setIsVideoOn(videoOn);
    }
  }, [localStream]);

  useEffect(() => {
    if (!showRejoinPopup) return;

    let timer: NodeJS.Timeout | null = null;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else {
      hardLeave();
      navigate("/createRoom", { replace: true });
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showRejoinPopup, countdown, hardLeave, navigate]);

  const handleEndCall = () => {
    softLeave();
    setShowRejoinPopup(true);
    setCountdown(10);
  };

  const handleRejoin = () => {
    setShowRejoinPopup(false);
    setCountdown(10);
    window.location.reload();
  };

  const meetingType = serverMeetingType;

  return (
    <div className="bg-card min-h-screen p-4 text-white flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center">
        {meetingType === "audio" ? (
          <div
            className={`grid ${getGridCols(participants.length)} gap-6 p-6 auto-rows-fr place-items-center`}
          >
            {participants.map((p) => (
              <div
                key={p.id}
                className="relative flex flex-col items-center justify-center bg-gray-900 rounded-xl p-4 shadow-lg 
                aspect-square w-full h-full min-w-[200px] min-h-[200px] sm:min-w-[250px] sm:min-h-[250px]
                md:min-w-[300px] md:min-h-[300px]"
              >
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-lg font-semibold shadow-lg
                  ${p.isLocal ? "bg-green-600" : "bg-gray-700"}`}
                >
                  {p.isLocal ? "You" : "P"}
                </div>

                {p.isLocal ? (
                  <LocalStream stream={p.stream} meetingType={meetingType} />
                ) : (
                  <RemoteStream stream={p.stream} meetingType={meetingType} />
                )}

                <div className="absolute bottom-3 right-3">
                  {p.isMicOn ? (
                    <FaMicrophoneAlt className="text-green-400 text-xl" />
                  ) : (
                    <FaMicrophoneAltSlash className="text-red-500 text-xl" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`grid ${getGridCols(participants.length)} gap-4 p-4 auto-rows-fr place-items-center`}
          >
            {participants.map((p) => (
              <div
                key={p.id}
                className="relative w-full h-full aspect-video rounded-2xl overflow-hidden shadow-lg flex items-center justify-center"
              >
                {p.isLocal ? (
                  <LocalStream stream={p.stream} meetingType={meetingType} />
                ) : (
                  <RemoteStream stream={p.stream} meetingType={meetingType} />
                )}
                <div className="absolute bottom-2 left-2 bg-black/50 text-xs px-2 py-1 rounded-md">
                  {p.isLocal ? "You" : "Participant"}
                </div>
                <div className="absolute bottom-3 right-3">
                  {p.isMicOn ? (
                    <FaMicrophoneAlt className="text-green-400 text-xl" />
                  ) : (
                    <FaMicrophoneAltSlash className="text-red-500 text-xl" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-20 bg-gray-900/80 rounded-xl mt-4 px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4 mx-auto">
          <button
            onClick={toggleMic}
            className="flex flex-col items-center justify-center p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          >
            {isMicOn ? <FaMicrophoneAlt className="text-xl" /> : <FaMicrophoneLinesSlash className="text-xl" />}
          </button>

          {meetingType === "video" && (
            <button
              onClick={toggleVideo}
              className="flex flex-col items-center justify-center p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              {isVideoOn ? <FaVideo className="text-xl" /> : <FaVideoSlash className="text-xl" />}
            </button>
          )}

          <button
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            onClick={() => setShowParticipants(!showParticipants)}
          >
            <FaUser className="text-lg" />
          </button>
          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition">
            <FaComments className="text-lg" />
          </button>

          <button
            onClick={handleEndCall}
            className="flex flex-col items-center justify-center p-3 rounded-full bg-red-600 hover:bg-red-500 transition transform rotate-45"
          >
            <FaPhone className="text-xl transform rotate-180" />
          </button>
        </div>

        {showParticipants && (
          <div className="absolute top-16 right-4 bg-gray-900 text-white rounded-2xl shadow-xl w-80 p-4 z-50">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-bold text-lg">People</h1>
              <button
                className="text-white hover:text-red-500 font-extrabold text-2xl p-1"
                onClick={() => setShowParticipants(false)}
              >
                ×
              </button>
            </div>

            <h5 className="text-gray-400 mb-2 text-sm">IN THE MEETING</h5>

            <div className="inline-block w-full">
              <div className="w-full bg-gray-800 rounded-lg text-white">
                <button
                  className="w-full flex justify-between items-center p-2 hover:bg-gray-700 transition rounded-lg"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="font-medium">Contributors</span>
                  <span className="flex items-center gap-1">
                    {participants.length}
                    <FaChevronDown
                      className={`transform transition-transform duration-300 ${showDropdown ? "rotate-180" : "rotate-0"}`}
                    />
                  </span>
                </button>

                {showDropdown && (
                  <ul className="mt-2 max-h-48 overflow-y-auto shadow-lg z-50 border-t border-gray-600">
                    {participants.map((p) => (
                      <li key={p.id} className="flex items-center gap-2 p-2 transition rounded">
                        <div className={`w-3 h-3 rounded-full ${p.isLocal ? "bg-green-500" : "bg-gray-400"}`} />
                        <span>{p.isLocal ? "You" : "Participant"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {showRejoinPopup && (
          <div className="bg-card fixed inset-0 flex items-center justify-center bg-opacity-60 z-50">
            <div className="bg-white text-black rounded-2xl p-6 w-96 text-center shadow-lg">
              <h2 className="text-lg font-bold mb-2">You left the meeting</h2>
              <p className="mb-4">
                Rejoin within <span className="font-semibold">{countdown}</span> seconds
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRejoin}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500"
                >
                  Rejoin
                </button>
                <button
                  onClick={() => {
                    hardLeave();
                    navigate("/createRoom", { replace: true });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-500"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meet;
