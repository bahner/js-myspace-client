/* eslint-disable no-console */

// AttachAddon doesn't work with WebSockets properly.
// import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import { Readline } from "xterm-readline";
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { evalCommandLine } from './commands.js';

let xterm;
// let attachAddon;
let fitAddon;
let readlineAddon;

const options = {
  cursorBlink: true,
  cursorStyle: 'underline',
};

export function initializeTerminal(socketUrl) {

  xterm = new Terminal(options);

  fitAddon = new FitAddon();
  xterm.loadAddon(fitAddon);

  xterm.loadAddon(new WebLinksAddon());

  readlineAddon = new Readline();
  xterm.loadAddon(readlineAddon); // Load readlineAddon into xterm

  xterm.open(document.getElementById('terminal'));

  return { xterm, fitAddon };
}

export function log(txt) {
  console.info(txt);
  xterm.writeln(txt);
}

export function readLine() {
  readlineAddon.read("> ")
    .then(processLine);
}

function processLine(text) {

  // readlineAddon.println("you entered: " + text);
  //FIXME: add pubsub interaction here!

  const output = evalCommandLine(text);
  readlineAddon.println(output);
  setTimeout(readLine, 1000); // Call readline again in 1s
}