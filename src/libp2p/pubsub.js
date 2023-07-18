import { libp2p } from '../libp2p.js';
import { xterm } from '../terminal.js';

export const pubsub = libp2p.services.pubsub

pubsub.addEventListener('message', (message) => {
    if (message.topicIDs && message.topicIDs.length > 0) {
      const topic = message.topicIDs[0];
      const data = new TextDecoder().decode(message.data);
      const msg = `${topic}: ${data}`;
      console.log(msg);
      xterm.writeln(msg);
    }
  });
