import { h } from "../lib/mini-vue.esm.js";
const App = {
  render() {
    return h("div", { id: "root", class: ["red", "blue"] }, [
      "hello world " + this.msg,
      h("p", { class: "black" }, "this is a child component"),
    ]);
  },
  setup() {
    return {
      msg: "mini-vue3",
    };
  },
};

export default App;
