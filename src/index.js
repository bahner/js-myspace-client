import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from 'xterm';
import { all } from '@libp2p/websockets/filters'
import { bootstrap } from '@libp2p/bootstrap'
import { createLibp2p } from 'libp2p'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { mplex } from '@libp2p/mplex'
import { multiaddr } from '@multiformats/multiaddr'
import { noise } from '@chainsafe/libp2p-noise'
// import { webRTC } from '@libp2p/webrtc'
import { webRTCStar } from '@libp2p/webrtc-star'
// tcp module fails miserably with webpack. I suspect it's not for the browser.
// import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'

const WebRtc = webRTCStar()
const topic = 'myspace'
const rendezvous = 'myspace'

const gossipsub_options = {
  emitSelf: true, // whether to emit to self on publish
  gossipIncoming: true, // emit incoming messages to the `gossip` event
  allowPublishToZeroPeers: true, // allow publish when no peers connected
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

async function init() {
  // Initialize libp2p
  console.log("Creating libp2p node");
  const node = await createLibp2p(modules);

  console.log("Discovering peers");
  node.on('peer:discovery', function (peerId) {
    console.log('found peer: ', peerId.toB58String())
  })

  console.log("Starting libp2p node");
  await node.start();

  // Initialize input functionality
  const inputField = document.createElement('input');
  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const message = inputField.value;
      node.services.pubsub.publish(topic, new TextEncoder().encode(message));
      inputField.value = '';
    }
  });
  document.body.appendChild(inputField);

  // Subscribe to the topic
  node.services.pubsub.subscribe(topic, (message) => {
    const chatMessage = new TextDecoder().decode(message.data);
    terminal.writeln(chatMessage);
  });
}
// Invoke the function to initialize the chat client
init().catch(console.error);
