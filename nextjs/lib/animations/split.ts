"use client";

import { ensureJasmineGsap } from "./eases";

export function splitText(
  target: Element | Element[] | string,
  vars: SplitText.Vars,
) {
  const { SplitText } = ensureJasmineGsap();
  return SplitText.create(target, {
    aria: "none",
    ...vars,
  });
}

export function duplicateTextForHover(element: HTMLElement, count = 2) {
  const text = element.textContent ?? "";
  element.innerHTML = "";

  for (let index = 0; index < count; index += 1) {
    const layer = document.createElement("span");
    layer.className = "char-hover-layer";
    layer.textContent = text;
    element.appendChild(layer);
  }
}
