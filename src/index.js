import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from 'xterm';
import { bootstrap } from '@libp2p/bootstrap'
import { createLibp2p } from 'libp2p'
import { filters } from '@libp2p/websockets/filters'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import {noise} from '@chainsafe/libp2p-noise'
// tcp module fails miserably with webpack. I suspect it's not for the browser.
// import { tcp } from '@libp2p/tcp'
import { websockets } from '@libp2p/websockets'

async function init() {
  // Initialize libp2p
  const node = await createLibp2p({
    modules: {
      transport: [tcp()],
      pubsub: Gossipsub,
      peerDiscovery: [Bootstrap]
    },
    config: {
      peerDiscovery: {
        bootstrap: {
          enabled: true,
          list: ['bootstrapPeerMultiaddress1', 'bootstrapPeerMultiaddress2'] // replace these with actual bootstrap peers
        }
      }
    }
  });

  await node.start();

  // Subscribe to a topic
  node.pubsub.subscribe('chat', (message) => {
    const chatMessage = new TextDecoder().decode(message.data);
    terminal.writeln(chatMessage);
  });

  // Initialize xterm.js
  const terminal = new Terminal();
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(document.getElementById('terminal'));
  fitAddon.fit();

  // Implement basic input and output functionality
  let buffer = '';
  terminal.onKey(({ key }) => {
    if (key === '\r') { // user pressed enter
      node.pubsub.publish('chat', new TextEncoder().encode(buffer));
      buffer = '';
    } else if (key === '\u007F') { // user pressed backspace
      if (buffer.length > 0) {
        buffer = buffer.slice(0, buffer.length - 1);
      }
    } else {
      buffer += key;
    }
    terminal.write(key);
  });
}

// Invoke the function to initialize the chat client
init().catch(console.error);
