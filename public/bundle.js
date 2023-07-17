"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _xterm = require("xterm");
var _xtermAddonFit = require("xterm-addon-fit");
var _gossipsub = _interopRequireDefault(require("./gossipsub.js"));
var terminal = new _xterm.Terminal();
var fitAddon = new _xtermAddonFit.FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal-container'));
fitAddon.fit();

// Load createLibp2pNode from gossipsub.js
var topic = 'myspace';
var rendezvousString = 'myspace';
var node;

// Handle the input field
var inputField = document.getElementById('input-field');
inputField.addEventListener('keydown', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(event) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(event.key === 'Enter')) {
            _context.next = 9;
            break;
          }
          // Prevent the form from being submitted
          event.preventDefault();

          // Initialize the node if it is not yet created
          if (node) {
            _context.next = 7;
            break;
          }
          _context.next = 5;
          return (0, _gossipsub["default"])(topic, rendezvousString);
        case 5:
          node = _context.sent;
          node.pubsub.on(topic, function (msg) {
            terminal.writeln(msg.data.toString());
          });
        case 7:
          // Publish the message
          node.pubsub.publish(topic, Buffer.from(inputField.value));

          // Clear the input field
          inputField.value = '';
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
