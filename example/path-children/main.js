import { createApp, h } from "../../lib/mini-vue.esm.js";
import { ArrayToText } from "./array2text.js";
import { TextToArray } from "./text2array.js";
import { TextToText } from "./text2text.js";

const App = {
  render() {
    return h("div", {}, [
      h("p", {}, "主页"),
      // text -> text
      h(TextToText),
      // array -> text
      h(ArrayToText),
      // text -> array
      h(TextToArray),
      // array -> array
    ]);
  },
};

createApp(App).mount("#app");
