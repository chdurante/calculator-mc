import { calcular, resetar } from "../core/calculadora.js";

export function setupEventosUI() {
  document.getElementById("btn-calcular").addEventListener("click", calcular);
  document.getElementById("btn-resetar").addEventListener("click", () => {
    resetar();
    document.getElementById("usar-cripto").checked = false;
  });
}
