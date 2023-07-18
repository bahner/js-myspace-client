/* eslint-disable no-console */
import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from 'xterm';

export function initializeTerminal() {
  const terminal = new Terminal();
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(document.getElementById('terminal'));
  return { terminal, fitAddon };
}

export function log(txt, something) {
  something.textContent += '';
  console.info(txt);
  something.textContent += `${txt.trim()}\n`;
}

export function attachListeners(libp2p, log) {
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
