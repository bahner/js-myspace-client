/* eslint-disable no-console */

import { evalCommand as evalCommandLine, isCommand as isCommandLine } from './commands.js';

// AttachAddon doesn't work with WebSockets properly.
// import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import { Readline } from "xterm-readline";
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { defaultPrompt } from './config.js';

const xterm = new Terminal({
  cursorBlink: true,
  cursorStyle: 'underline'
});
const fitAddon = new FitAddon();
const readlineAddon = new Readline();

let topic

export function initializeTerminal(socketUrl) {

  xterm.loadAddon(fitAddon);
  xterm.loadAddon(new WebLinksAddon());
  xterm.loadAddon(readlineAddon);
  xterm.open(document.getElementById('terminal'));

  return { xterm, fitAddon };
}

export function readLine(ts, topic) {
  topic = topic
  readlineAddon.read(defaultPrompt)
    .then((line) => processLine(line, ts));
}
function processLine(line, ts, topic) {
  line = line.trim();
  let type;

  if (line === '') {
    type = 'empty';
  }
  else if (isCommandLine(line)) {
    type = 'command';
  } else {
    type = 'message';
  }

  switch (type) {
    case 'empty':
      break;
    case 'command':
      evalCommand(line);
      break;
    default:
      ts.publish(topic, new TextEncoder().encode(line));
      break;
  }

//   const output = evalCommandLine(text);
//   readlineAddon.println(output);
  setTimeout(readLine, 1000); // Call readline again in 1s
}