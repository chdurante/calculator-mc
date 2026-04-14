import { DataStore } from "../domain/materiaisService.js";
import { getItemKeyByNome, parseItemString, formatCurrency } from "./utils.js";

const materialNomes = {
  // Materiais base
  ferro: "Ferro",
  cobre: "Cobre",
  aluminio: "Alumínio",
  plastico: "Plástico",
  borracha: "Borracha",
  sucataMetal: "Sucata de Metal",
  // Componentes SMG
  canoSmg: "Cano de Submetralhadora",
  carregadorSmg: "Carregador de Submetralhadora",
  coronhaSmg: "Coronha de Submetralhadora",
  ferrolhoSmg: "Ferrolho de Submetralhadora",
  estruturaArma: "Estrutura de Arma",
  gatilhoArma: "Gatilho de Arma",
  percussorArma: "Percussor de Arma",
  molaRecuperadora: "Mola Recuperadora de Arma",
  empunhaduraArma: "Empunhadura de Arma"
};

export function gerarListaItens(itensEscolhidos, precos) {
  return itensEscolhidos.map(item => {
    const { quantidade, nome } = parseItemString(item);
    const itemKey = getItemKeyByNome(nome);
    const ico = DataStore.itens[itemKey]?.ico || "";
    const valorItem = quantidade * (precos[itemKey] || 0);

    return `
      <div class="item-produzido">
        ${ico ? `<img src="${ico}" alt="${nome}" onerror="this.style.display='none'">` : ""}
        <div class="item-produzido-info">
          <span class="item-produzido-nome">${nome}</span>
          <span class="item-produzido-qty">${quantidade}x</span>
        </div>
        ${valorItem > 0 ? `<span class="item-produzido-valor">$ ${formatCurrency(valorItem)}</span>` : ""}
      </div>
    `;
  }).join("");
}

export function gerarTabelaMateriais(totalMateriais) {
  const linhas = Object.entries(totalMateriais)
    .sort((a, b) => b[1] - a[1])
    .map(([mat, qtd]) => {
      const nome = materialNomes[mat] || mat;
      return `
        <div class="material-row">
          <span class="material-nome">${nome}</span>
          <span class="material-qtd">${qtd.toLocaleString("pt-BR")}</span>
        </div>
      `;
    }).join("");

  return `<div class="materiais-grid">${linhas}</div>`;
}

export function gerarTabelaHierarquica(itensEscolhidos, receitasUsadas) {
  let html = `
    <div class="hierarquia-materiais">
      <h3>📋 Hierarquia de Materiais</h3>
  `;

  itensEscolhidos.forEach(item => {
    const { quantidade, nome } = parseItemString(item);
    const itemKey = getItemKeyByNome(nome);

    if (!itemKey || !receitasUsadas[itemKey]) return;

    html += `
      <div class="item-hierarquia">
        <h4>🔫 ${nome} (${quantidade}x)</h4>
        <div class="nivel-1">
          <h5>📦 Materiais necessários:</h5>
          <ul>
    `;

    Object.entries(receitasUsadas[itemKey]).forEach(([mat, qtd]) => {
      const totalQtd = qtd * quantidade;
      const nomeMat = materialNomes[mat] || DataStore.itens[mat]?.nome || mat;
      html += `<li>${nomeMat}: ${totalQtd}</li>`;
    });

    html += `</ul></div>`;

    const temSubmateriais = Object.entries(receitasUsadas[itemKey]).some(([mat]) =>
      receitasUsadas[mat]
    );

    if (temSubmateriais) {
      html += `<div class="nivel-2"><h5>🔧 Submatérias:</h5>`;

      Object.entries(receitasUsadas[itemKey]).forEach(([mat, qtd]) => {
        if (!receitasUsadas[mat]) return;

        const totalQtd = qtd * quantidade;
        const nomeMat = materialNomes[mat] || DataStore.itens[mat]?.nome || mat;

        html += `
          <div class="submaterial">
            <strong>${nomeMat} (${totalQtd}x):</strong>
            <ul>
        `;

        Object.entries(receitasUsadas[mat]).forEach(([subMat, subQtd]) => {
          const totalSubQtd = subQtd * totalQtd;
          const nomeSubMat = materialNomes[subMat] || subMat;
          html += `<li>${nomeSubMat}: ${totalSubQtd}</li>`;
        });

        html += `</ul></div>`;
      });

      html += `</div>`;
    }

    html += `</div>`;
  });

  html += `</div>`;
  return html;
}

export function gerarResumoValor(valorTotal) {
  if (valorTotal > 0) {
    return `
      <div class="resumo-valor">
        <span class="resumo-label">💰 Cobrar do Cliente</span>
        <span class="resumo-preco">$ ${formatCurrency(valorTotal)}</span>
      </div>
    `;
  }
  return '';
}

export function traduzirMaterial(key) {
  return materialNomes[key] || key;
}
