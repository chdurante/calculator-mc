export function criarElementoComHTML(tag, html, className = "") {
    const el = document.createElement(tag);
    el.innerHTML = html;
    if (className) el.className = className;
    return el;
  }
  