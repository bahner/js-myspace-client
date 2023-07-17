import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import createLibp2pNode from './gossipsub.js';

const terminal = new Terminal();
const fitAddon = new FitAddon();

terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal-container'));
fitAddon.fit();

// Load createLibp2pNode from gossipsub.js
const topic = 'myspace';
const rendezvousString = 'myspace';
let node;

// Handle the input field
const inputField = document.getElementById('input-field');
inputField.addEventListener('keydown', async function(event) {
  // Check if the key is the Enter key
  if (event.key === 'Enter') {
    // Prevent the form from being submitted
    event.preventDefault();

    // Initialize the node if it is not yet created
    if (!node) {
      node = await createLibp2pNode(topic, rendezvousString);
      node.pubsub.on(topic, (msg) => {
        terminal.writeln(msg.data.toString());
      });
    }

    // Publish the message
    node.pubsub.publish(topic, Buffer.from(inputField.value));

    // Clear the input field
    inputField.value = '';
  }
});
