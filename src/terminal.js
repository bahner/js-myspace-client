/* eslint-disable no-console */

// AttachAddon doesn't work with WebSockets properly.
// import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import { Readline } from "xterm-readline";
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';

let topicSocket;
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
  topicSocket = generateTopicSocket(socketUrl);

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
  readlineAddon.read(">")
    .then(processLine);
}

function processLine(text) {
  readlineAddon.println("you entered: " + text);
  if(topicSocket.readyState === WebSocket.OPEN){
    topicSocket.send(text);
  }
  setTimeout(readLine, 10); // Call readline again in 10ms
}

function generateTopicSocket(socketUrl) {
  if (topicSocket) {
    topicSocket.close();
  }

  topicSocket = new WebSocket(socketUrl);

  topicSocket.onmessage = function (event) {
    console.debug("WebSocket message received:", event);
    xterm.writeln(event.data);
  };

  topicSocket.onopen = function (event) {
    console.debug("WebSocket is open now.");
  };

  topicSocket.onclose = function (event) {
    console.debug("WebSocket is closed now.", event);
  };

  topicSocket.onerror = function (event) {
    console.log("WebSocket encountered error: ", event);
    // Handle error appropriately if applicable
  };
  
  return topicSocket;
}
