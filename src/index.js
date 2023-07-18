import { initializeTerminal, log } from './terminal.js';

import { attachListeners } from './listeners.js';
import { defaultTopic } from './constants.js';
import { readLine } from './terminal.js';
import { startLibp2p } from './libp2p.js';

async function main() {
  // Topic is set in the terminal which uses it to connect to the topic socket
  const { xterm, fitAddon } = initializeTerminal();

  fitAddon.fit();
  window.onresize = (evt) => {
    fitAddon.fit()
  }

  const libp2p = await startLibp2p();
  const pubsub = libp2p.services.pubsub

  pubsub.addEventListener('message', (message) => {
    const topic = message.detail.topic
    const data = new TextDecoder().decode(message.detail.data)
    const msg = `${message.detail.topic}: ${data}`
    console.log(msg)
    xterm.writeln(msg)
  })
  
  pubsub.subscribe(defaultTopic)
  
  pubsub.publish(defaultTopic, new TextEncoder().encode('banana'))
  // attachListeners(libp2p, updateTerminal);

  log('libp2p started!');
  log(`libp2p id is ${libp2p.peerId.toString()}`);
  xterm.writeln(`libp2p id is ${libp2p.peerId.toString()}`);
  xterm.writeln(`Hello ${defaultTopic}!\n`);

  readLine();

}

main();
