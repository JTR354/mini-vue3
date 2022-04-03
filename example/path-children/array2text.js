import { h, ref } from "../../lib/mini-vue.esm.js";

const prevChildren = [h("p", {}, "A"), h("p", {}, "B")];
const nextChildren = "array to text";
export const ArrayToText = {
  name: "ArrayToText",
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
