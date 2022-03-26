import { h } from "../lib/mini-vue.esm.js";
window.self = null;
const App = {
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        class: ["red", "blue"],
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("mouse down");
        },
      },
      [
        h("p", {}, "hello world " + this.msg),
        h("p", { class: "black" }, "this is a child component"),
      ]
    );
  },
  setup() {
    return {
      msg: "mini-vue3-hah",
    };
  },
};

export default App;
