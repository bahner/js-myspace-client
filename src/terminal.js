/* eslint-disable no-console */
import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from 'xterm';

let terminal;

export function initializeTerminal() {
  terminal = new Terminal();
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(document.getElementById('terminal'));
  return { terminal, fitAddon };
}

export function log(txt) {
  console.info(txt);
  terminal.writeln(txt);
}
