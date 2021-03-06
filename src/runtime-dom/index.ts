import { createRenderer } from "../runtime-core";
import { isOn } from "../shared";

function createElement(type) {
  return document.createElement(type);
}

function pathProp(el: HTMLElement, key, preValue, newValue) {
  if (key === "class" && Array.isArray(newValue)) {
    newValue = newValue.join(" ");
  }
  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, newValue);
  } else {
    if (newValue == null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, newValue);
    }
  }
}

function insert(child, parent: HTMLElement, anchor = null) {
  parent.insertBefore(child, anchor);
}

function setElementText(el, text) {
  el.textContent = text;
}

function remove(child: HTMLElement) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

const options = {
  createElement,
  pathProp,
  insert,
  setElementText,
  remove,
};

const renderer = createRenderer(options);

export const createApp = renderer.createApp;

export * from "../runtime-core";
