import { h } from "../lib/mini-vue.esm.js";
const App = {
  render() {
    return h(
      "div",
      { id: "root", class: ["red", "blue"] },
      "mini-vue" + this.msg
    );
  },
  setup() {
    return {
      msg: "hello world",
    };
  },
};

export default App;
