import { carregarDados,carregarDadosCompra } from './domain/materiaisService.js';
import { gerarHTMLCategorias } from './ui/renderer.js';
import { setupEventosUI } from './ui/eventosUI.js';
import { gerarUICompra, calcularRetornoCompra, resetarCompra } from "./ui/compraUI.js";

document.addEventListener("DOMContentLoaded", async () => {
  await carregarDados();
  await carregarDadosCompra();
  gerarHTMLCategorias();
  setupEventosUI();
  gerarUICompra(); 
});

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((t) => t.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});
