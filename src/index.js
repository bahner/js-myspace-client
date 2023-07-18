import { changeTopic, createNode, publishMessage, subscribeToTopic } from './libp2p';

import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from 'xterm';

async function init() {
  // Initialize libp2p node
  const node = await createNode();

  // Initialize xterm.js
  const terminal = new Terminal();
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(document.getElementById('terminal'));
  fitAddon.fit();

  terminal.writeln('Welcome to the chat terminal!');
  terminal.writeln('Use /say <message>, /shout <message>, or /change topic <topic>');

  terminal.onKey(async ({ key, domEvent }) => {
    const printable = !domEvent.altKey && !domEvent.altGraphKey && !domEvent.ctrlKey && !domEvent.metaKey;

    // Handle enter
    if (domEvent.keyCode === 13) {
      terminal.writeln('');

      const input = terminal.buffer.active.cursorY - 1;
      const line = terminal.buffer.active.getLine(input);
      const message = line.translateToString(true);

      if (message.startsWith('/say ')) {
        const text = message.substring(5);
        await publishMessage(node, text);
      } else if (message.startsWith('/shout ')) {
        const text = message.substring(7).toUpperCase();
        await publishMessage(node, text);
      } else if (message.startsWith('/change topic ')) {
        const topic = message.substring(14);
        await changeTopic(node, topic);
      } else {
        terminal.writeln(`Unknown command: ${message}`);
      }

      terminal.write('> ');
    } 
    // Handle backspace
    else if (domEvent.keyCode === 8) {
      // Do not delete the prompt
      if (terminal.buffer.active.cursorX > 2) {
        terminal.write('\b \b');
      }
    } 
    // Handle printable keys
    else if (printable) {
      terminal.write(key);
    }
  });

  terminal.writeln('');
  terminal.write('> ');

  // Subscribe to the topic
  subscribeToTopic(node, (chatMessage) => {
    terminal.writeln(`\n< ${chatMessage}`);
    terminal.write('> ');
  });
}

init().catch(console.error);
