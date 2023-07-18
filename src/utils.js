import { initializeTerminal } from "./terminal.js";
import { topicBaseUrl } from "./constants.js";

function getTopicUrl(topic) {
    return `${topicBaseUrl}/${topic}`;
}

export function setTopic(topic) {
    const url = getTopicUrl(topic);
    return initializeTerminal(url);
}
