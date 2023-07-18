/* eslint-disable no-console */

import { webRTC, webRTCDirect } from '@libp2p/webrtc'

import { bootstrap } from '@libp2p/bootstrap'
import { circuitRelayTransport } from 'libp2p/circuit-relay'
import { createLibp2p } from 'libp2p'
import { identifyService } from 'libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
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
    bootstrap({
      list: [
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
      ]
    })
  ],
  services: {
    // the identify service is used by the DHT and the circuit relay transport
    // to find peers that support the relevant protocols
    identify: identifyService(),

    // the DHT is used to find circuit relay servers we can reserve a slot on
    dht: kadDHT({
      // browser node ordinarily shouldn't be DHT servers
      clientMode: true
    })
  }
}

export async function startLibp2p() {
  // Create our libp2p node
  const libp2p = await createLibp2p(modules)

  return libp2p
}