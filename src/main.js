var terminal = new Terminal();
var fitAddon = new FitAddon.FitAddon();

terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal-container'));
fitAddon.fit();

// Load createLibp2pNode from rendezvous.js
var createLibp2pNode = require('./gossipsub.js');
var topic = 'myspace';
var rendezvousString = 'myspace';
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

