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

// 5.2 移动
// ab(cde)fg
// ab(ecd)fg
// prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C", id: "prev-c" }, "C"),
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "E" }, "E"),
//   h("div", { key: "F" }, "F"),
//   h("div", { key: "G" }, "G"),
// ];

// nextChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "E" }, "E"),
//   h("div", { key: "C", id: "prev-c" }, "C"),
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "F" }, "F"),
//   h("div", { key: "G" }, "G"),
// ];

// 5.2 移动
// ab(cde)fg
// ab(ecdH)fg

// prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C", id: "prev-c" }, "C"),
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "E" }, "E"),
//   h("div", { key: "F" }, "F"),
//   h("div", { key: "G" }, "G"),
// ];

// nextChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "E" }, "E"),
//   h("div", { key: "C", id: "prev-c" }, "C"),
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "H" }, "H"),
//   h("div", { key: "F" }, "F"),
//   h("div", { key: "G" }, "G"),
// ];

// 6. 综合排序测试
// a,b,(c,d,e,z),f,g
// a,b,(d,c,y,e),f,g
// 最长子序列： [1,3]

// prevChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
//   h("p", { key: "D" }, "D"),
//   h("p", { key: "E" }, "E"),
//   h("p", { key: "Z" }, "Z"),
//   h("p", { key: "F" }, "F"),
//   h("p", { key: "G" }, "G"),
// ];

// nextChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "D" }, "D"),
//   h("p", { key: "C" }, "C"),
//   h("p", { key: "Y" }, "Y"),
//   h("p", { key: "E" }, "E"),
//   h("p", { key: "F" }, "F"),
//   h("p", { key: "G" }, "G"),
// ];

// fix bug
prevChildren = [
  h("p", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
  h("p", { key: "D" }, "D"),
  h("p", { key: "DD" }, "DD"),
  h("p", { id: "c-prev" }, "CC"),
  h("p", { key: "E" }, "E"),
];
nextChildren = [
  h("p", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
  h("p", { id: "c-next" }, "Cd"),
  h("p", { key: "D" }, "D"),
  h("p", { key: "D" }, "DD"),
  h("p", { key: "E" }, "E"),
];

export const ArrayToArray = {
  setup() {
    const isChange = ref(false);
    // window.isChange = isChange;
    const onClick = () => {
      isChange.value = !isChange.value;
    };
    return { isChange, onClick };
  },
  render() {
    return h("div", { id: "children" }, [
      h("button", { onClick: this.onClick }, "toggle"),
      h("div", {}, !this.isChange ? prevChildren : nextChildren),
    ]);
  },
};
