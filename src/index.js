import { initializeTerminal, log, readLine } from './terminal.js';

import { attachListeners } from './listeners.js';
import { startLibp2p } from './libp2p.js';

const topicBaseUrl = 'ws://localhost:5002/api/v0/topics';
// const topicBaseUrl = 'ws://localhost:12345/api/v0/topics';
const defaultTopic = 'myspace';

function getTopicUrl(topic) {
  return `${topicBaseUrl}/${topic}`;
}

function setTopic(topic) {
  const url = getTopicUrl(topic);
  return initializeTerminal(url);
}
async function main() {
  const { xterm, fitAddon} = await setTopic(defaultTopic);
  
  fitAddon.fit();
  
  window.onresize = (evt) => {
    fitAddon.fit()
  }
  // function updateTerminal(txt) {
  //   log(txt, log);
  // }

  // const libp2p = await startLibp2p();
  // // attachListeners(libp2p, updateTerminal);

  // log('libp2p started!');
  // log(`libp2p id is ${libp2p.peerId.toString()}`);
  // xterm.writeln(`libp2p id is ${libp2p.peerId.toString()}`);
  xterm.writeln(`Hello ${defaultTopic}!`);

  readLine();

}

main();
