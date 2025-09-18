


import * as mediasoup from "mediasoup";
import { Server, Socket } from "socket.io";

let worker: mediasoup.types.Worker;

const rooms: Record<
  string,
  { router: mediasoup.types.Router; peers: string[]; meetingType: "audio" | "video" }
> = {};

const peers: Record<
  string,
  {
    socket: Socket;
    roomName?: string;
    transports: string[];
    producers: string[];
    consumers: string[];
    isMicOn: boolean;
  }
> = {};

type TransportEntry = {
  socketId: string;
  transport: mediasoup.types.WebRtcTransport;
  roomName: string;
  consumer: boolean;
};

type ProducerEntry = {
  socketId: string;
  producer: mediasoup.types.Producer;
  roomName: string;
};

type ConsumerEntry = {
  socketId: string;
  consumer: mediasoup.types.Consumer;
  roomName: string;
};

let transports: TransportEntry[] = [];
let producers: ProducerEntry[] = [];
let consumers: ConsumerEntry[] = [];

const mediaCodecs: mediasoup.types.RtpCodecCapability[] = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
    preferredPayloadType: 100,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: { "x-google-start-bitrate": 1000 },
    preferredPayloadType: 101,
    rtcpFeedback: [
      { type: "nack" },
      { type: "nack", parameter: "pli" },
      { type: "ccm", parameter: "fir" },
      { type: "goog-remb" },
    ],
  },
];

const createWorker = async () => {
  if (worker) return worker;

  worker = await mediasoup.createWorker({
    rtcMinPort: 2000,
    rtcMaxPort: 2100,
  });

  worker.on("died", () => {
    console.error("Mediasoup worker died, exiting in 2 seconds...");
    setTimeout(() => process.exit(1), 2000);
  });

  return worker;
};

const createWebRtcTransport = async (router: mediasoup.types.Router) => {
  const transport = await router.createWebRtcTransport({
    listenIps: [{ ip: "127.0.0.1", announcedIp: undefined }],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  });

  transport.on("dtlsstatechange", (state) => {
    if (state === "closed") transport.close();
  });

  transport.on("routerclose", () => {
    transport.close();
  });

  return transport;
};

export default async function mediasoupHandler(io: Server, socket: Socket) {
  await createWorker();

  console.log("Mediasoup socket connected:", socket.id);
  socket.emit("connection-success", { socketId: socket.id });

  const removeItems = <T extends { socketId: string }>(
    list: T[],
    socketId: string,
    closeFn?: (item: T) => void
  ) => {
    list.forEach((item) => {
      if (item.socketId === socketId && closeFn) {
        try {
          closeFn(item);
        } catch (err) {
          console.log(err);
        }
      }
    });
    return list.filter((item) => item.socketId !== socketId);
  };

  const handleLeave = () => {
    console.log("peer leaving/disconnecting:", socket.id);

    consumers = removeItems(consumers, socket.id, (entry) => entry.consumer.close());
    producers = removeItems(producers, socket.id, (entry) => entry.producer.close());
    transports = removeItems(transports, socket.id, (entry) => entry.transport.close());

    const { roomName } = peers[socket.id] || {};
    delete peers[socket.id];

    if (roomName && rooms[roomName]) {
      rooms[roomName].peers = rooms[roomName].peers.filter((id) => id !== socket.id);

      if (rooms[roomName].peers.length === 0) {
        try {
          rooms[roomName].router.close();
        } catch {}
        delete rooms[roomName];
        console.log(`Room ${roomName} closed as it became empty`);
      }
    }
  };

  socket.on("leaveRoom", handleLeave);
  socket.on("disconnect", handleLeave);

  socket.on("joinRoom", async ({ roomName, isAdmin, meetingType }, callback) => {
    try {
      let room = rooms[roomName];

      if (!room) {
        if (!isAdmin) {
          callback({ error: "Room does not exist. Please ask admin to start the meeting." });
          return;
        }
        const router = await worker.createRouter({ mediaCodecs });
        rooms[roomName] = { router, peers: [], meetingType };
        room = rooms[roomName];
      }

      rooms[roomName].peers.push(socket.id);
      peers[socket.id] = {
        socket,
        roomName,
        transports: [],
        producers: [],
        consumers: [],
        isMicOn: true,
      };

      const existingProducers = producers
        .filter((p) => p.roomName === roomName && p.socketId !== socket.id)
        .map((p) => ({
          producerId: p.producer.id,
          peerId: p.socketId,
          isMicOn: peers[p.socketId]?.isMicOn ?? true,
        }));

      callback({
        rtpCapabilities: room.router.rtpCapabilities,
        existingProducers,
        meetingType: room.meetingType,
        peerId: socket.id,
      });
    } catch (err) {
      console.error("joinRoom error:", err);
      callback({ error: "joinRoom failed on server" });
    }
  });

  socket.on("createWebRtcTransport", async ({ consumer }, callback) => {
    try {
      const peer = peers[socket.id];
      if (!peer || !peer.roomName) {
        callback({ error: "Peer not found or not in a room" });
        return;
      }

      const router = rooms[peer.roomName].router;
      const transport = await createWebRtcTransport(router);

      transports.push({ socketId: socket.id, transport, roomName: peer.roomName, consumer: !!consumer });
      peer.transports.push(transport.id);

      callback({
        params: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        },
      });
    } catch (err) {
      console.error("createWebRtcTransport error:", err);
      callback({ error: "createWebRtcTransport failed" });
    }
  });

  const getTransportById = (
    socketId: string,
    transportId?: string,
    requireConsumer = false
  ) => {
    if (!transportId) {
      return transports.find((t) => t.socketId === socketId && !t.consumer)?.transport;
    }
    return transports.find(
      (t) =>
        t.socketId === socketId &&
        t.transport.id === transportId &&
        (!requireConsumer || t.consumer)
    )?.transport;
  };

  socket.on("transport-connect", async ({ dtlsParameters }, callback) => {
    try {
      const transport = getTransportById(socket.id);
      if (!transport) {
        callback({ error: "transport not found" });
        return;
      }

      await transport.connect({ dtlsParameters });
      callback({});
    } catch (err) {
      console.error("transport-connect error:", err);
      callback({ error: "transport-connect failed" });
    }
  });

  socket.on("transport-produce", async ({ kind, rtpParameters }, callback) => {
    try {
      const transport = getTransportById(socket.id);
      if (!transport) {
        callback({ error: "No transport for producing" });
        return;
      }

      const producer = await transport.produce({ kind, rtpParameters });

      const peer = peers[socket.id];
      if (!peer || !peer.roomName) {
        try {
          producer.close();
        } catch {}
        callback({ error: "Peer or room not found" });
        return;
      }

      const roomName = peer.roomName;
      const room = rooms[roomName];

      if (room.meetingType === "audio" && kind === "video") {
        try {
          producer.close();
        } catch {}
        callback({ error: "Video not allowed in audio-only meeting" });
        return;
      }

      producers.push({ socketId: socket.id, producer, roomName });
      peer.producers.push(producer.id);

      room.peers.forEach((peerId) => {
        if (peerId !== socket.id) {
          peers[peerId]?.socket.emit("new-producer", {
            producerId: producer.id,
            peerId: socket.id,
          });
        }
      });

      producer.on("transportclose", () => producer.close());

      callback({
        id: producer.id,
        producersExist: producers.some((p) => p.roomName === roomName && p.socketId !== socket.id),
      });
    } catch (err) {
      console.error("transport-produce error:", err);
      callback({ error: "transport-produce failed" });
    }
  });

  socket.on("getProducers", (callback) => {
    const peer = peers[socket.id];
    if (!peer || !peer.roomName) return callback([]);
    const list = producers
      .filter((p) => p.roomName === peer.roomName && p.socketId !== socket.id)
      .map((p) => ({ producerId: p.producer.id, peerId: p.socketId }));
    callback(list);
  });

  socket.on("mic-status-changed", ({ roomName, userId, isMicOn }) => {
    if (!rooms[roomName]) return;
    if (peers[userId]) {
      peers[userId].isMicOn = isMicOn;
    }

    rooms[roomName].peers.forEach((peerId) => {
      if (peerId !== socket.id) {
        peers[peerId]?.socket.emit("participant-mic-updated", { peerId: userId, isMicOn });
      }
    });
  });

  socket.on("transport-recv-connect", async ({ dtlsParameters, serverConsumerTransportId }, callback) => {
    try {
      const consumerTransport = getTransportById(socket.id, serverConsumerTransportId, true);
      if (!consumerTransport) {
        callback({ error: "consumer-transport-not-found" });
        return;
      }
      await consumerTransport.connect({ dtlsParameters });
      callback();
    } catch (err) {
      console.error("transport-recv-connect error:", err);
      callback({ error: "transport-recv-connect failed" });
    }
  });

  socket.on("consume", async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }, callback) => {
    try {
      const peer = peers[socket.id];
      if (!peer || !peer.roomName) {
        callback({ error: "Peer not in a room" });
        return;
      }
      const router = rooms[peer.roomName].router;
      const consumerTransport = getTransportById(socket.id, serverConsumerTransportId, true);

      if (!consumerTransport) {
        callback({ error: "Consumer transport not found" });
        return;
      }

      if (!router.canConsume({ producerId: remoteProducerId, rtpCapabilities })) {
        callback({ error: "cannot-consume" });
        return;
      }

      const consumer = await consumerTransport.consume({
        producerId: remoteProducerId,
        rtpCapabilities,
        paused: true,
      });

      consumers.push({ socketId: socket.id, consumer, roomName: peer.roomName });
      peer.consumers.push(consumer.id);

      consumer.on("transportclose", () => consumer.close());
      consumer.on("producerclose", () => {
        socket.emit("producer-closed", { remoteProducerId });
        consumer.close();
        consumers = consumers.filter((c) => c.consumer.id !== consumer.id);
      });

      callback({
        params: {
          id: consumer.id,
          producerId: remoteProducerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          serverConsumerId: consumer.id,
        },
      });
    } catch (err) {
      console.error("consume error:", err);
      callback({ error: "consume failed" });
    }
  });

  socket.on("consumer-resume", async ({ serverConsumerId }, callback) => {
    try {
      const entry = consumers.find((c) => c.consumer.id === serverConsumerId);
      const consumer = entry?.consumer;
      if (!consumer) {
        callback?.({ error: "consumer-not-found" });
        return;
      }
      await consumer.resume();
      callback?.();
    } catch (err) {
      console.error("consumer-resume error:", err);
      callback?.({ error: "consumer-resume-failed" });
    }
  });
}
