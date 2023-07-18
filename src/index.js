import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from 'xterm';
import { createNode, publishMessage, subscribeToTopic } from './libp2p';

async function init() {
  // Initialize libp2p node
  const node = await createNode();

  // Initialize xterm.js
  const terminal = new Terminal();
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(document.getElementById('terminal'));
  fitAddon.fit();

  // Initialize input functionality
  const inputField = document.createElement('input');
  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const message = inputField.value;
      publishMessage(node, message);
      inputField.value = '';
    }
  });
  document.body.appendChild(inputField);

  // Subscribe to the topic
  subscribeToTopic(node, (chatMessage) => {
    terminal.writeln(chatMessage);
  });
}

init().catch(console.error);
