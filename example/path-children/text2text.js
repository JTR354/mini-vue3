import { h, ref } from "../../lib/mini-vue.esm.js";

const prevChildren = "old children";
const nextChildren = "new children";
export const TextToText = {
  name: "TextToText",
  setup() {
    const isChange = ref(true);
    window.isChange = isChange;
    return {
      isChange,
    };
  },
  render() {
    return this.isChange
      ? h("div", {}, prevChildren)
      : h("div", {}, nextChildren);
  },
};
