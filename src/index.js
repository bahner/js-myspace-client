import { defaultTopic } from './config.js';
import { initializeTerminal } from './terminal.js';
import { readLine } from './terminal.js';
import { startLibp2p } from './libp2p.js';
import { startPubsubListener } from './libp2p/pubsub.js';

let xterm

const libp2p = await startLibp2p();
const pubsub = libp2p.services.pubsub

function main() {

  xterm = initializeTerminal();

  helloWorld(xterm);

  readLine(pubsub, defaultTopic, xterm);
}

function helloWorld() {

  startPubsubListener(pubsub, xterm);

  pubsub.subscribe(defaultTopic)
  pubsub.publish(defaultTopic, new TextEncoder().encode('banana'))

  xterm.writeln(`libp2p id is ${libp2p.peerId.toString()}`);
  xterm.writeln(`Current topic is "${defaultTopic}"!\n`);
  xterm.writeln('Hello World!');
}

main();
