/* eslint-disable no-console */

import { evalCommand, isCommand } from './commands.js';

import { FitAddon } from 'xterm-addon-fit';
import { Readline } from "xterm-readline";
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { config } from './config.js';
import { libp2p } from './libp2p.js';
import { pubsub } from './libp2p/pubsub.js';

export const xterm = new Terminal({
  cursorBlink: true,
  cursorStyle: 'underline'
});
const fitAddon = new FitAddon();
const readlineAddon = new Readline();


xterm.loadAddon(fitAddon);
xterm.loadAddon(new WebLinksAddon());
xterm.loadAddon(readlineAddon);
xterm.open(document.getElementById('terminal'));

fitAddon.fit();

window.onresize = (evt) => {
  fitAddon.fit()
}


export function readLine() {

  let prompt = config.getPrompt();

  readlineAddon.read(prompt)
    .then((line) => processLine(line));
}

function processLine(line) {

  let topic = config.getTopic();

  line = line.trim();
  let type;

  if (line === '') {
    type = 'empty';
  }
  else if (isCommand(line)) {
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
      pubsub.publish(topic, new TextEncoder().encode(line));
      break;
  }

  xterm.writeln(type); // debug info
  setTimeout(readLine(pubsub), 1000);
}

export function initTopicTerminal () {

  let topic = config.getTopic();

  pubsub.subscribe(topic)
  pubsub.publish(topic, new TextEncoder().encode('banana'))
  
  xterm.clear();
  xterm.writeln(`libp2p id is ${libp2p.peerId.toString()}`);
  xterm.writeln(`Current topic is "${topic}"!\n`);
  xterm.writeln('Hello World!');

}