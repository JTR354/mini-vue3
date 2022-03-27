import { ShapeFlags } from "./../shared/ShapeFlags";
export function initSlots(instance, children) {
  // instance.slots = Array.isArray(children) ? children : [children];
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}
function normalizeObjectSlots(children: any, slots: any) {
  if (typeof children === "object") {
    for (let key in children) {
      const value = children[key];
      slots[key] = (props) => normalizeSlotValue(value(props));
    }
  }
}

function normalizeSlotValue(value: any) {
  return Array.isArray(value) ? value : [value];
}
