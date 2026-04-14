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

export function gerarListaItens(itensEscolhidos) {
  return itensEscolhidos.map(item => {
    const { quantidade, nome } = parseItemString(item);
    const itemKey = getItemKeyByNome(nome);
    const valorItem = quantidade * (DataStore.precos[itemKey] || 0);

    if (valorItem > 0) {
      return `<li>🔹${item} - $ ${formatCurrency(valorItem)}</li>`;
    } else {
      return `<li>🔹${item}</li>`;
    }
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
      <div class="flex-container">
        <div class="flex-item green">
          <h4>💰 Cobrar do Cliente</h4>
          <p>$ ${formatCurrency(valorTotal)}</p>
        </div>
      </div>
    `;
  }

  return '';
}

export function traduzirMaterial(key) {
  return materialNomes[key] || key;
}
