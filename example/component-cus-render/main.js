import { createRenderer, h } from "../../lib/mini-vue.esm.js";

let app = new PIXI.Application({ width: 640, height: 360 });
document.body.appendChild(app.view);

const options = {
  createElement(type) {
    if (type === "rect") {
      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();

      return rect;
    }
  },
  pathProp(key, value, el) {
    el[key] = value;
  },
  insert(el, parent) {
    parent.addChild(el);
  },
};
const renderer = createRenderer(options);

const App = {
  render() {
    return h("rect", { x: 100, y: 100 });
  },
};

renderer.createApp(App).mount(app.stage);
