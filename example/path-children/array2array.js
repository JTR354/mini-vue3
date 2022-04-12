import { h, ref } from "../../lib/mini-vue.esm.js";

let prevChildren;
let nextChildren;

// 1. 左侧相同对比
// (a,b)c
// (a,b)de
// i=3 e1=2 e2=3

// prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];
// nextChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "E" }, "E"),
// ];

// 2. 右侧相同对比
//  a(bc)
// de(bc)
// i=0 e1=0 e2=1
// prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];
// nextChildren = [
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "E" }, "E"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];

// 3. 新的比老的长(创建新的)
// 左侧相同
// (a,b)
// (a,b)cd
// i=3 e1=2 e2=3
prevChildren = [h("div", { key: "A" }, "A"), h("div", { key: "B" }, "B")];
nextChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "C" }, "C"),
  h("div", { key: "D" }, "D"),
];

// 右侧相同
//   (bc)
// de(bc)
// i=0 e1=-1 e2=1
prevChildren = [h("div", { key: "B" }, "B"), h("div", { key: "C" }, "C")];
nextChildren = [
  h("div", { key: "D" }, "D"),
  h("div", { key: "E" }, "E"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "C" }, "C"),
];

// 4. 老的比新的长(删除旧的)
// 左侧相同
// (ab)cd
// (ab)
// i=2 e1=3 e2=1
prevChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "C" }, "C"),
  h("div", { key: "D" }, "D"),
];
nextChildren = [h("div", { key: "A" }, "A"), h("div", { key: "B" }, "B")];

// 右侧相同
// de(bc)
//   (bc)
// i=0 e1=1 e2=-1
prevChildren = [
  h("div", { key: "D" }, "D"),
  h("div", { key: "E" }, "E"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "C" }, "C"),
];
nextChildren = [h("div", { key: "B" }, "B"), h("div", { key: "C" }, "C")];

// 5. 对比中间部分

// 5.1-1 删除
// ab(cd)ef
// ab(gc)ef
prevChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "C", id: "prev-c" }, "C"),
  h("div", { key: "D" }, "D"),
  h("div", { key: "E" }, "E"),
  h("div", { key: "F" }, "F"),
];
nextChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "G" }, "G"),
  h("div", { key: "C", id: "next-c" }, "C"),
  h("div", { key: "E" }, "E"),
  h("div", { key: "F" }, "F"),
];

// 5.1-2 删除优化
// ab(cdg h)ef
// ab(dc)ef

prevChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "C", id: "prev-c" }, "C"),
  h("div", { key: "D" }, "D"),
  h("div", { key: "G" }, "G"),
  h("div", { key: "H" }, "H"),
  h("div", { key: "E" }, "E"),
  h("div", { key: "F" }, "F"),
];
nextChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "D" }, "D"),
  h("div", { key: "C", id: "next-c" }, "C"),
  h("div", { key: "E" }, "E"),
  h("div", { key: "F" }, "F"),
];

export const ArrayToArray = {
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;
    return { isChange };
  },
  render() {
    return h(
      "div",
      { id: "children" },
      !this.isChange ? prevChildren : nextChildren
    );
  },
};
