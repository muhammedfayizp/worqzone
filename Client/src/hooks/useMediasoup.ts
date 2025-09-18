
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

type ConsumerTransportData = {
  consumerTransport: mediasoupClient.types.Transport;
  serverConsumerTransportId: string;
  producerId: string;
  consumer: mediasoupClient.types.Consumer;
};

type RemoteStreamEntry = {
  id: string;
  stream: MediaStream;
  isMicOn?: boolean;
  isVideoOn?: boolean;
};

export function useMediasoup(roomName: string, meetingType: "audio" | "video", isAdmin: boolean) {
  const socketRef = useRef<Socket | null>(io("http://localhost:3000", { autoConnect: false }));
  const device = useRef<mediasoupClient.Device | null>(null);
  const rtpCapabilities = useRef<any>(null);

  const producerTransport = useRef<mediasoupClient.types.Transport | null>(null);
  const consumerTransports = useRef<ConsumerTransportData[]>([]);
  const pendingProducers = useRef<{ producerId: string; peerId: string }[]>([]);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStreamEntry[]>([]);
  const [serverMeetingType, setServerMeetingType] = useState<'audio' | 'video'>(meetingType);

  const getSocket = () => socketRef.current!;

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on("connection-success", ({ socketId }) => {
      console.log("Connected (server ack). socketId:", socketId);
      getLocalStream(meetingType);
    });

    socket.on("new-producer", ({ producerId, peerId }) => {
      if (!device.current || !device.current.loaded) {
        pendingProducers.current.push({ producerId, peerId });
      } else {
        goConsume(producerId, peerId);
      }
    });

    socket.on("producer-closed", ({ remoteProducerId }) => {
      consumerTransports.current = consumerTransports.current.filter((ct) => {
        if (ct.producerId === remoteProducerId) {
          try { ct.consumerTransport.close(); } catch { }
          try { ct.consumer.close(); } catch { }
          setRemoteStreams((prev) =>
            prev.map(s => {
              const trackIds = ct.consumer.track ? [ct.consumer.track.id] : [];
              const newTracks = s.stream.getTracks().filter(t => !trackIds.includes(t.id));
              return s.stream.getTracks().length === newTracks.length ? s : { ...s, stream: new MediaStream(newTracks) };
            })
          );
          return false;
        }
        return true;
      });
    });

    socket.on("participant-mic-updated", ({ peerId, isMicOn }: { peerId: string; isMicOn: boolean }) => {
      setRemoteStreams((prev) => prev.map((p) => (p.id === peerId ? { ...p, isMicOn } : p)));
    });

    socket.on("participant-video-updated", ({ peerId, isVideoOn }: { peerId: string; isVideoOn: boolean }) => {
      setRemoteStreams((prev) => prev.map((p) => (p.id === peerId ? { ...p, isVideoOn } : p)));
    });

    socket.on("participant-left", ({ peerId }: { peerId: string }) => {
      setRemoteStreams((prev) => prev.filter((p) => p.id !== peerId));
    });

    return () => {
      try { softLeave(); } catch { }
      socket.removeAllListeners();
      try { socket.disconnect(); } catch { }
    };
  }, []);

  useEffect(() => {
    if (localStream) joinRoom();
  }, [localStream]);

  const joinRoom = () => {
    const socket = getSocket();
    socket.emit("joinRoom", { roomName, isAdmin, meetingType }, (data: any) => {
      if (data?.error) {
        alert(data.error);
        return;
      }

      setServerMeetingType(data.meetingType || meetingType);
      rtpCapabilities.current = data.rtpCapabilities;

      if (Array.isArray(data.existingPeers) && data.existingPeers.length > 0) {
        setRemoteStreams((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const newEntries = data.existingPeers
            .filter((p: any) => !existingIds.has(p.peerId))
            .map((p: any) => ({
              id: p.peerId,
              stream: new MediaStream(), 
              isMicOn: p.isMicOn,
              isVideoOn: p.isVideoOn,
            }));
          return [...prev, ...newEntries];
        });
      }

      createDevice().then(() => {
        pendingProducers.current.forEach(({ producerId, peerId }) => goConsume(producerId, peerId));
        pendingProducers.current = [];
        data.existingProducers?.forEach((p: any) => goConsume(p.producerId, p.peerId));
      });
    });
  };

  const softLeave = () => {
    try { producerTransport.current?.close(); } catch { }
    consumerTransports.current.forEach(({ consumer, consumerTransport }) => {
      try { consumer.close(); } catch { }
      try { consumerTransport.close(); } catch { }
    });
    consumerTransports.current = [];

    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }

    setRemoteStreams([]);
    const socket = socketRef.current;
    if (socket && socket.connected) socket.emit("leaveRoom");
  };

  const hardLeave = () => {
    softLeave();
    const socket = socketRef.current;
    if (socket) {
      socket.removeAllListeners();
      try { socket.disconnect(); } catch { }
    }
  };

  const createDevice = async () => {
    if (!rtpCapabilities.current) throw new Error("Router RTP capabilities missing.");
    device.current = new mediasoupClient.Device();
    await device.current.load({ routerRtpCapabilities: rtpCapabilities.current });
    await createSendTransport();
  };

  const createSendTransport = () =>
    new Promise<void>((resolve) => {
      const socket = getSocket();
      socket.emit("createWebRtcTransport", { consumer: false }, (resp: any) => {
        if (!resp || resp.error) {
          console.error("createWebRtcTransport error:", resp?.error);
          resolve();
          return;
        }
        const { params } = resp;
        producerTransport.current = device.current!.createSendTransport(params);

        producerTransport.current.on("connect", ({ dtlsParameters }, callback) => {
          const sock = getSocket();
          sock.emit("transport-connect", { dtlsParameters }, callback);
        });

        producerTransport.current.on("produce", async (parameters, callback, errback) => {
          try {
            const { kind, rtpParameters } = parameters;
            const sock = getSocket();
            sock.emit("transport-produce", { kind, rtpParameters }, (data: any) => {
              if (!data || data.error) return errback(new Error(data?.error || "No id returned"));
              callback({ id: data.id });
              getProducers();
            });
          } catch (err) {
            console.error(err);
            errback(err as Error);
          }
        });

        if (localStream) connectSendTransport();
        resolve();
      });
    });

  const getProducers = () => {
    const socket = getSocket();
    socket.emit("getProducers", (producerEntries: { producerId: string; peerId: string }[]) => {
      if (!producerEntries || !Array.isArray(producerEntries)) return;
      producerEntries.forEach((p) => goConsume(p.producerId, p.peerId));
    });
  };

  const getLocalStream = async (type: "audio" | "video") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        type === "audio" ? { audio: true, video: false } : { audio: true, video: true }
      );

      const savedMicState = localStorage.getItem("micState");
      const savedVideoState = localStorage.getItem("videoState");

      if (savedMicState !== null) {
        const micOn = JSON.parse(savedMicState);
        stream.getAudioTracks().forEach((track) => (track.enabled = micOn));
      }

      if (savedVideoState !== null) {
        const videoOn = JSON.parse(savedVideoState);
        stream.getVideoTracks().forEach((track) => (track.enabled = videoOn));
      }

      setLocalStream(stream);
    } catch (err) {
      console.error("Error getting local stream", err);
    }
  };

  const connectSendTransport = async () => {
    if (!localStream || !producerTransport.current) return;

    for (const track of localStream.getTracks()) {
      if (meetingType === "audio" && track.kind === "video") continue;
      await producerTransport.current.produce({
        track,
        encodings: track.kind === "video" ? [
          { rid: "r0", maxBitrate: 100000 },
          { rid: "r1", maxBitrate: 300000 },
          { rid: "r2", maxBitrate: 900000 }
        ] : undefined,
        codecOptions: track.kind === "video" ? { videoGoogleStartBitrate: 1000 } : undefined,
      });
    }
  };

  const goConsume = (remoteProducerId: string, peerId: string) => {
    createRecvTransport(remoteProducerId, peerId);
  };

  const createRecvTransport = (remoteProducerId: string, peerId: string) => {
    const socket = getSocket();
    socket.emit("createWebRtcTransport", { consumer: true }, ({ params }: any) => {
      const consumerTransport = device.current!.createRecvTransport(params);

      consumerTransport.on("connect", ({ dtlsParameters }, callback) => {
        const sock = getSocket();
        sock.emit("transport-recv-connect", { dtlsParameters, serverConsumerTransportId: consumerTransport.id }, callback);
      });

      connectRecvTransport(consumerTransport, remoteProducerId, peerId, params.id);
    });
  };

  const connectRecvTransport = (
    consumerTransport: mediasoupClient.types.Transport,
    remoteProducerId: string,
    peerId: string,
    serverConsumerTransportId: string
  ) => {
    const socket = getSocket();
    socket.emit("consume", {
      rtpCapabilities: device.current!.rtpCapabilities,
      remoteProducerId,
      serverConsumerTransportId,
    }, async ({ params }: any) => {
      if (!params) {
        console.warn("consume: no params returned");
        return;
      }
      const consumer = await consumerTransport.consume({
        id: params.id,
        producerId: params.producerId,
        kind: params.kind,
        rtpParameters: params.rtpParameters,
      });

      if (serverMeetingType === "audio" && consumer.kind === "video") {
        try { consumer.close(); } catch { }
        return;
      }

      consumerTransports.current.push({ consumerTransport, serverConsumerTransportId, producerId: remoteProducerId, consumer });

      setRemoteStreams(prev => {
        const existing = prev.find(s => s.id === peerId);
        if (existing) {
          const updatedStream = new MediaStream(existing.stream.getTracks());
          updatedStream.addTrack(consumer.track);
          return prev.map(s => s.id === peerId ? { ...s, stream: updatedStream } : s);
        } else {
          return [...prev, { id: peerId, stream: new MediaStream([consumer.track]), isMicOn: false }];
        }
      });

      socket.emit("consumer-resume", { serverConsumerId: params.serverConsumerId });
    });
  };

  const micStatus = (isMicOn: boolean) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;
    socket.emit("mic-status-changed", {
      roomName,
      userId: socket.id,
      isMicOn,
    });
  };

  const videoStatus = (isVideoOn: boolean) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;
    socket.emit("video-status-changed", {
      roomName,
      userId: socket.id,
      isVideoOn,
    });
  };

  return { localStream, remoteStreams, meetingType: serverMeetingType, softLeave, hardLeave, micStatus, videoStatus };
}
