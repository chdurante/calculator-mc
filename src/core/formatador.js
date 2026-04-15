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

const ORDEM_MATERIAIS = ["ferro", "cobre", "aluminio", "plastico", "borracha", "sucataMetal"];
const CUSTO_POR_UNIDADE = 6;

export function gerarTabelaMateriais(totalMateriais) {
  let totalUnidadesSemSucata = 0;
  let totalCustoSemSucata = 0;

  const linhas = ORDEM_MATERIAIS
    .filter(mat => totalMateriais[mat])
    .map(mat => {
      const qtd = totalMateriais[mat];
      const nome = materialNomes[mat];
      const isSucata = mat === "sucataMetal";
      const custo = isSucata ? null : qtd * CUSTO_POR_UNIDADE;

      if (!isSucata) {
        totalUnidadesSemSucata += qtd;
        totalCustoSemSucata += custo;
      }

      return `
        <div class="material-row ${isSucata ? "material-sucata" : ""}">
          <span class="material-nome">${nome}</span>
          <div class="material-right">
            <span class="material-qtd">${qtd.toLocaleString("pt-BR")}</span>
            ${!isSucata
              ? `<span class="material-custo">$ ${formatCurrency(custo)}</span>`
              : `<span class="material-custo material-custo-nd">—</span>`
            }
          </div>
        </div>
      `;
    }).join("");

  const totalBlock = totalUnidadesSemSucata > 0 ? `
    <div class="materiais-total">
      <div class="materiais-total-row">
        <span>Total a comprar</span>
        <span>${totalUnidadesSemSucata.toLocaleString("pt-BR")} unidades</span>
      </div>
      <div class="materiais-total-row destaque">
        <span>💸 Custo total</span>
        <span>$ ${formatCurrency(totalCustoSemSucata)}</span>
      </div>
      <p class="materiais-obs">* Sucata de Metal não incluída no custo</p>
    </div>
  ` : "";

  return `
    <div class="materiais-grid">
      <div class="materiais-header">
        <span>Material</span>
        <div class="material-right">
          <span>Qtd</span>
          <span>Custo (@$6/un)</span>
        </div>
      </div>
      ${linhas}
    </div>
    ${totalBlock}
  `;
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
