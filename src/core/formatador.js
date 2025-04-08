import { DataStore } from "../domain/materiaisService.js";

const materialNomes = {
  cobalto: "Cobalto",
  aco: "Aço",
  aluminioNaval: "Alumínio Naval",
  polietileno: "Polietileno",
  borrachaFluorada: "Borracha Fluorada",
  titanio: "Titânio",
  vidroTemperado: "Vidro Temperado",
  cripto: "Cripto"
};

export function gerarListaItens(itensEscolhidos) {
  return itensEscolhidos.map(item => {
    const [quantidade, nome] = item.split("x").map(str => str.trim());
    const itemKey = Object.keys(DataStore.itens).find(key => DataStore.itens[key].nome === nome);
    const valorItem = parseInt(quantidade) * (DataStore.precos[itemKey] || 0);

    return `<li>${item} - $ ${valorItem.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</li>`;
  }).join("");
}

export function gerarTabelaMateriais(totalMateriais) {
  let html = `
    <table class="result-table">
      <tr><th>Material</th><th>Quantidade</th></tr>
  `;

  for (const mat in totalMateriais) {
    const nome = materialNomes[mat] || mat;
    html += `<tr><td>${nome}</td><td>${totalMateriais[mat]}</td></tr>`;
  }

  html += `</table>`;
  return html;
}

export function gerarResumoRecicladoEValor(reciclado, valorTotal) {
  return `
    <div class="flex-container">
      <div class="flex-item gold">
        <h4>⚙️ Materiais Recicláveis</h4>
        <p>${Math.ceil(reciclado).toLocaleString("pt-BR")}</p>
      </div>
      <div class="flex-item green">
        <h4>💰 Valor Total</h4>
        <p>$ ${valorTotal.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}</p>
      </div>
    </div>
  `;
}

export function traduzirMaterial(key) {
  return materialNomes[key] || key;
}