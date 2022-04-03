import { h, ref } from "../../lib/mini-vue.esm.js";

const Text = "text to array";
const Array = [h("p", {}, "A"), h("p", {}, "B")];
export const TextToArray = {
  name: "TextToArray",
  setup() {
    const isChange = ref(true);
    window.isChange = isChange;
    return {
      isChange,
    };
  },
  render() {
    return this.isChange ? h("div", {}, Text) : h("div", {}, Array);
  },
};
