import { initializeTerminal, log } from './terminal.js';

import { attachListeners } from './listeners.js';
import { startLibp2p } from './libp2p.js';

async function main() {
  const { terminal, fitAddon } = initializeTerminal();

  function updateTerminal(txt) {
    log(txt, log);
  }

  const libp2p = await startLibp2p();
  attachListeners(libp2p, updateTerminal);

  log('libp2p started!');
  log(`libp2p id is ${libp2p.peerId.toString()}`);
}

main();
