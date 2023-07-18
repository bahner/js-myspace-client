import { attachListeners } from './listeners.js';
import { defaultTopic } from './constants.js';
import { readLine } from './terminal.js';
import { setTopic } from './utils.js';
import { startLibp2p } from './libp2p.js';

function main() {
  // Topic is set in the terminal which uses it to connect to the topic socket
  const { xterm, fitAddon } = setTopic(defaultTopic);

  fitAddon.fit();
  window.onresize = (evt) => {
    fitAddon.fit()
  }

  const libp2p = startLibp2p();
  // attachListeners(libp2p, updateTerminal);

  // log('libp2p started!');
  // log(`libp2p id is ${libp2p.peerId.toString()}`);
  // xterm.writeln(`libp2p id is ${libp2p.peerId.toString()}`);
  xterm.writeln(`Hello ${defaultTopic}!\n`);

  readLine();

}

main();
