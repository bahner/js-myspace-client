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
