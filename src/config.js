// config.js
const config = {
    _prompt: "> ",
    _topic: "myspace",
    getPrompt() {
      return this._prompt;
    },
    setPrompt(value) {
      this._prompt = value;
    },
    getTopic() {
      return this._topic;
    },
    setTopic(value) {
      this._topic = value;
    }
  };
  
  export { config };
