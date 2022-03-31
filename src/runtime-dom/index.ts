import { createRenderer } from "../runtime-core";
import { isOn } from "../shared";

function createElement(type) {
  return document.createElement(type);
}

function pathProp(key, value, el) {
  if (key === "class" && Array.isArray(value)) {
    value = value.join(" ");
  }
  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, value);
  } else {
    el.setAttribute(key, value);
  }
}

function insert(el, parent) {
  parent.append(el);
}

function setElementText(el, text) {
  el.textContent = text;
}

const options = {
  createElement,
  pathProp,
  insert,
  setElementText,
};

const renderer = createRenderer(options);

export const createApp = renderer.createApp;

export * from "../runtime-core";
