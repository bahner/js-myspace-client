import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { identifyService } from 'libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht';

const gossibsubOptions = {
  emitSelf: true,
  // logger: {
  //   debug: (...args) => console.log('Gossipsub:', ...args),
  //   info: (...args) => console.log('Gossipsub:', ...args),
  //   warn: (...args) => console.log('Gossipsub:', ...args),
  //   error: (...args) => console.log('Gossipsub:', ...args)
  // }
}

export const gossipsubService = gossipsub(gossibsubOptions);

const kadDHTOptions = {
  clientMode: true
}

export const kadDHTService = kadDHT(kadDHTOptions)

export const identifyServiceService = identifyService