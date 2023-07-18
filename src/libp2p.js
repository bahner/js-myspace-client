import { all } from '@libp2p/websockets/filters'
import { createLibp2p } from 'libp2p'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { mplex } from '@libp2p/mplex'
import { noise } from '@chainsafe/libp2p-noise'
import { webRTCStar } from '@libp2p/webrtc-star'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'

const WebRtc = webRTCStar()
const topic = 'myspace'

const gossipsub_options = {
  emitSelf: true,
  gossipIncoming: true,
  allowPublishToZeroPeers: true,
}

const modules = {
  transports: [
    WebRtc.transport,
    webSockets({ filter: all }),
    webTransport({ filter: all }),
  ],
  connectionEnryption: [noise],
  streamMuxers: [mplex],
  peerDiscovery: [
    WebRtc.discovery,
  ],
  services: {
    pubsub: gossipsub(gossipsub_options)
  }
}

export async function createNode() {
  console.log("Creating libp2p node");
  const node = await createLibp2p(modules);

  console.log("Discovering peers");
  node.addEventListener('peer:discovery', function (peerId) {
    console.log('found peer: ', peerId.toB58String())
  })

  console.log("Connecting to peers");
  node.addEventListener('peer:connect', (peerId) => {
    console.log('connected to peer:', peerId.toB58String())
  })

  console.log("Starting libp2p node");
  await node.start();

  return node;
}

export function publishMessage(node, message) {
  node.services.pubsub.publish(topic, new TextEncoder().encode(message));
}

export function subscribeToTopic(node, callback) {
  node.services.pubsub.subscribe(topic, (message) => {
    const chatMessage = new TextDecoder().decode(message.data);
    callback(chatMessage);
  });
}
