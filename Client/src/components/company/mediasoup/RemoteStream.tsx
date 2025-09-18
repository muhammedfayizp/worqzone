
import { useEffect, useRef, memo } from "react";

type Props = { 
  stream: MediaStream;
  meetingType: "audio" | "video";
};

const RemoteStream = ({ stream, meetingType }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = meetingType === "audio" ? audioRef.current : videoRef.current;
    if (el) {
      if (stream) {
        el.srcObject = stream;
      } else {
        el.srcObject = null;
      }
    }
  }, [stream, meetingType]);

  if (!stream || stream.getTracks().length === 0) return null;

  return meetingType === "audio" ? (
    <audio 
      ref={audioRef} 
      autoPlay 
      playsInline 
      className="hidden"
    />
  ) : (
    <video 
      ref={videoRef} 
      autoPlay 
      playsInline 
      className="h-auto rounded-xl object-cover" 
    />
  );
};

export default memo(RemoteStream);
