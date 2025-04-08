import { carregarDados } from './domain/materiaisService.js';
import { gerarHTMLCategorias } from './ui/renderer.js';
import { setupEventosUI } from './ui/eventosUI.js';

document.addEventListener("DOMContentLoaded", async () => {
  await carregarDados();
  gerarHTMLCategorias();
  setupEventosUI();
});
