import { config } from "../config.js";
import { initTopicTerminal } from "../terminal.js";

export function evalTopic(params) {
    if (params === null) {
        return "Error: no topic specified";
    }

    if (params.length > 1) {
        return "Error: too many parameters";
    }

    const topic = params[0];
    config.setTopic(topic);
    
    initTopicTerminal();
 
    return `Topic set to ${topic}`;
}