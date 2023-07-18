export function evalTopic(params) {
    if (params === null) {
        return "Error: no topic specified";
    }

    if (params.length > 1) {
        return "Error: too many parameters";
    }

    const topic = params[0];
    const url = getTopicUrl(topic);
 
    setTopic(topic);
 
    return `Topic set to ${topic}`;
}