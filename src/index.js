/* eslint-disable no-console */
// Import xterm.js and its required addons
import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from 'xterm';
import { startLibp2p } from './libp2p.js'

async function main() {

  const something = document.getElementById('terminal')
  // Create a new xterm.js Terminal instance
  const terminal = new Terminal();

  // Create a FitAddon instance to automatically fit the terminal within its container
  const fitAddon = new FitAddon();
  // terminal.loadAddon(fitAddon);

  // Attach the xterm.js Terminal to an existing DOM element
  // terminal.open(document.getElementById('terminal'));

  // UI update functions using xterm.js
  function log(txt) {
    something.textContent += ''
    console.info(txt);
    something.textContent += `${txt.trim()}\n`
    // fitAddon.fit();
  }

  const libp2p = await startLibp2p()

  // Listen for new peers
  libp2p.addEventListener('peer:discovery', (evt) => {
    const peerInfo = evt.detail;
    log(`Found peer ${peerInfo.id.toString()}`);

    // Dial them when we discover them
    libp2p.dial(peerInfo.id).catch(err => {
      log(`Could not dial ${peerInfo.id.toString()}`, err);
    });
  });

  // Listen for new connections to peers
  libp2p.addEventListener('peer:connect', (evt) => {
    const peerId = evt.detail;
    log(`Connected to ${peerId.toString()}`);
  });

  // Listen for peers disconnecting
  libp2p.addEventListener('peer:disconnect', (evt) => {
    const peerId = evt.detail;
    log(`Disconnected from ${peerId.toString()}`);
  });

  log('libp2p started!');
  log(`libp2p id is ${libp2p.peerId.toString()}`);
}

main()