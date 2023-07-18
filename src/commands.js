import { evalTopic } from "./commands/topic.js";

const commandRegex = /^\/(\w+)\s*(.*)$/;

export function evalCommand(input, ts) {
    input = input.trim();

    // If input is empty, do nothing
    if (input === '') {
        return;
    }

    // If it's not a command, publish the input to the topic
    if (!isCommand(input)) {
        ts.publish(input);
        return;
    }

    const {command, params} = extractCommandAndParams(input);

    // If it's a command, handle it
    switch (command) {
        case "topic":
            return evalTopic(params, ts);
        default:
            return "Error: unknown command";
    }
}

export function isCommand(inputString) {
    return commandRegex.test(inputString);
}

function extractCommandAndParams(inputString) {
    const result = commandRegex.exec(inputString);
    if (result) {
        const command = result[1];
        const paramsString = result[2];
        let params = paramsString.split(/\s+/);

        // if params only contains a single empty string, set it to null
        if (params.length === 1 && params[0] === '') {
            params = null;
        }

        return {command, params};
    } else {
        return null;
    }
}
