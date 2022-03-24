import { h } from "./mini-vue.esm.js";
const App = {
  render() {
    console.log(this.msg);
    return h("div", { id: "root", class: ["red", "blue"] }, "min-vue");
  },
  setup() {
    return {
      msg: "hello world",
    };
  },
};

export default App;
