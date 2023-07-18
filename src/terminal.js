/* eslint-disable no-console */
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import { Readline } from "xterm-readline";
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';

let topicSocket;
let xterm;
let attachAddon;
let fitAddon;
let readlineAddon;

const options = {
  cursorBlink: true,
  cursorStyle: 'underline',
};

export function initializeTerminal(socketUrl) {
  return new Promise((resolve, reject) => {
    if (topicSocket) {
      topicSocket.close();
    }

    xterm = new Terminal(options);
    topicSocket = new WebSocket(socketUrl);

    topicSocket.onopen = function (event) {
      console.debug("WebSocket is open now.");

      fitAddon = new FitAddon();
      xterm.loadAddon(fitAddon);

      xterm.loadAddon(new WebLinksAddon());

      readlineAddon = new Readline();
      xterm.loadAddon(readlineAddon); // Load readlineAddon into xterm

      xterm.open(document.getElementById('terminal'));

      // Resolve the promise with the xterm, fitAddon, and readlineAddon instances
      resolve({ xterm, fitAddon, readlineAddon });
    };

    topicSocket.onclose = function (event) {
      console.debug("WebSocket is closed now.", event);
    };

    topicSocket.onerror = function (event) {
      console.log("WebSocket encountered error: ", event);
      reject(event);  // Reject the promise if there's an error
    };
  });
}

export function log(txt) {
  console.info(txt);
  xterm.writeln(txt);
}

export function readLine() {
  readlineAddon.read(">")
    .then(processLine);
}

function processLine(text) {
  readlineAddon.println("you entered: " + text);
  topicSocket.send(text);
  setTimeout(readLine);
}
