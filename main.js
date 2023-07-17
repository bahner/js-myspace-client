var terminal = new Terminal();
var fitAddon = new FitAddon.FitAddon();

terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal-container'));
fitAddon.fit();

// Handle the input field
var inputField = document.getElementById('input-field');
inputField.addEventListener('keydown', function(event) {
    // Check if the key is the Enter key
    if (event.key === 'Enter') {
        // Prevent the form from being submitted
        event.preventDefault();

        // Write the input to the terminal
        terminal.writeln(inputField.value);

        // Clear the input field
        inputField.value = '';
    }
});
