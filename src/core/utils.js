// Utilitários compartilhados para o sistema
import { DataStore } from "../domain/materiaisService.js";

// Cache global para busca de itens
const itemKeyCache = new Map();

export function getItemKeyByNome(nome) {
  if (itemKeyCache.has(nome)) {
    return itemKeyCache.get(nome);
  }
  
  const itemKey = Object.keys(DataStore.itens).find(key => DataStore.itens[key].nome === nome);
  itemKeyCache.set(nome, itemKey);
  return itemKey;
}

export function parseItemString(item) {
  const [quantidade, nome] = item.split("x").map(str => str.trim());
  return { quantidade: parseInt(quantidade), nome };
}

export function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function clearCache() {
  itemKeyCache.clear();
}
