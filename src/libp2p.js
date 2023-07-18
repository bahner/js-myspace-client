/* eslint-disable no-console */

import { gossipsubService, identify as identifyService, kadDHTService } from './libp2p/services.js'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'

import { bootstrapDiscovery } from './libp2p/discovery.js'
import { circuitRelayTransport } from 'libp2p/circuit-relay'
import { createLibp2p } from 'libp2p'
import { mplex } from '@libp2p/mplex'
import { noise } from '@chainsafe/libp2p-noise'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { yamux } from '@chainsafe/libp2p-yamux'

const modules = {
  // transports allow us to dial peers that support certain types of addresses
  transports: [
    webSockets(),
    webTransport(),
    webRTC(),
    webRTCDirect(),
    circuitRelayTransport({
      // use content routing to find a circuit relay server we can reserve a
      // slot on
      discoverRelays: 1
    })
  ],
  connectionEncryption: [noise()],
  streamMuxers: [yamux(), mplex()],
  peerDiscovery: [
    bootstrapDiscovery
  ],
  services: {
    // the identify service is used by the DHT and the circuit relay transport
    // to find peers that support the relevant protocols
    identify: identifyService,

    // the DHT is used to find circuit relay servers we can reserve a slot on
    dht: kadDHTService,
    pubsub: gossipsubService
  }
}

export async function startLibp2p() {
  // Create our libp2p node
  const libp2p = await createLibp2p(modules)

  return libp2p
}


export function attachLibp2pListeners(libp2p, log) {
  libp2p.addEventListener('peer:discovery', (evt) => {
    const peerInfo = evt.detail;
    log(`Found peer ${peerInfo.id.toString()}`);
    libp2p.dial(peerInfo.id).catch(err => {
      log(`Could not dial ${peerInfo.id.toString()}`, err);
    });
  });

  libp2p.addEventListener('peer:connect', (evt) => {
    const peerId = evt.detail;
    log(`Connected to ${peerId.toString()}`);
  });

  libp2p.addEventListener('peer:disconnect', (evt) => {
    const peerId = evt.detail;
    log(`Disconnected from ${peerId.toString()}`);
  });
}
