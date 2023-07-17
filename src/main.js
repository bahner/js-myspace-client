var terminal = new Terminal();
var fitAddon = new FitAddon.FitAddon();

terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal-container'));
fitAddon.fit();

// Load libp2p
var createLibp2pNode = require('./rendezvous.js'); // Renamed from ./libp2p.js
var topic = 'myspace'; // This is now your default topic
var rendezvousString = 'myspace'; // This is now your default rendezvous string
var node;

// Handle the input field
var inputField = document.getElementById('input-field');
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
