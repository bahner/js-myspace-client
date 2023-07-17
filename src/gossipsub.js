import { createLibp2p } from 'libp2p';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';

const createLibp2pNode = async (topic, rendezvousString) => {
  const options = { /* you need to fill this according to your needs */ };

  const libp2p = await createLibp2p({
    // Other libp2p options can be put here...
    modules: {
      pubsub: gossipsub,
    },
    config: {
      pubsub: {
        enabled: true,
      },
      // Other configuration options...
    },
  });

  libp2p.on('peer:discovery', (peerId) => {
    console.log('Discovered:', peerId.toB58String()); // Log discovered peers
  });

  await libp2p.start();

  libp2p.pubsub.on('message', (message) => {
    console.log(`${message.topic}:`, new TextDecoder().decode(message.data));
  });

  await libp2p.pubsub.subscribe(topic);

  // Publish a message to the topic
  libp2p.pubsub.publish(topic, new TextEncoder().encode(rendezvousString));

  return libp2p;
};

export default createLibp2pNode;
