import { evalTopic } from "./commands/topic.js";

export function evalCommandLine(input, ts) {
    input = input.trim();

    const {command, params} = extractCommandAndParams(input);

    switch (command) {
        case "topic":
            return evalTopic(params, ts);
        default:
            return "Error: unknown command";
    }

}

function extractCommandAndParams(inputString) {
    const regex = /^\/(\w+)\s*(.*)$/;
    const result = regex.exec(inputString);
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
