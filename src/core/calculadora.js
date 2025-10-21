import { DataStore } from "../domain/materiaisService.js";
import { gerarListaItens, gerarTabelaMateriais, gerarTabelaHierarquica, gerarResumoValor } from "./formatador.js";
import { getItemKeyByNome, parseItemString } from "./utils.js";

export function calcular() {
  const usarCripto = document.getElementById("usar-cripto").checked;
  const receitasUsadas = usarCripto ? DataStore.receitasComCripto : DataStore.receitas;

  esconderCategorias();
  
  // Mostrar loading
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Calculando materiais...</p>
    </div>
  `;

  // Simular delay para melhor UX (opcional)
  setTimeout(() => {
    const { totalItens, totalMateriais, itensEscolhidos } = calcularMateriaisEItens(receitasUsadas);

    if (totalItens === 0) {
      resultDiv.innerHTML = `
        <div class="alerta">
          <strong>Nenhum item selecionado</strong>
          <p>Informe ao menos 1 item para calcular os materiais necessários.</p>
        </div>`;
      return;
    }

    const valorTotal = calcularValorTotal(itensEscolhidos);
    resultDiv.innerHTML = `
      <h3>Relatório de Produção</h3>
      <p><strong>🛠️ Itens Produzidos:</strong></p>
      <ul>${gerarListaItens(itensEscolhidos)}</ul>
      <p><strong>📦 Total Geral:</strong> ${totalItens} itens</p>
      ${gerarTabelaHierarquica(itensEscolhidos, receitasUsadas)}
      <h3>📊 Total de Materiais Básicos</h3>
      ${gerarTabelaMateriais(totalMateriais)}
      ${gerarResumoValor(valorTotal)}
    `;
  }, 100);
}

export function resetar() {
  document.querySelectorAll("input[type='number']").forEach(input => input.value = 0);
  const resultDiv = document.getElementById("result");
  Object.assign(resultDiv.style, { display: "none" });
  resultDiv.innerHTML = "";
  document.querySelectorAll(".itens").forEach(div => div.style.display = "none");
}

function esconderCategorias() {
  document.querySelectorAll(".itens").forEach(div => div.style.display = "none");
}

function calcularMateriaisEItens(receitasUsadas) {
  let totalItens = 0;
  const totalMateriais = {};
  const itensEscolhidos = [];

  for (const [itemKey, item] of Object.entries(DataStore.itens)) {
    const input = document.getElementById(itemKey);
    const quantidade = input ? parseInt(input.value) || 0 : 0;

    if (quantidade > 0) {
      itensEscolhidos.push(`${quantidade}x ${item.nome}`);
      totalItens += quantidade;

      // Calcular materiais recursivamente
      const materiaisCalculados = calcularMateriaisRecursivo(itemKey, quantidade, receitasUsadas);
      
      for (const [mat, qtd] of Object.entries(materiaisCalculados)) {
        totalMateriais[mat] = (totalMateriais[mat] || 0) + qtd;
      }
    }
  }

  return { totalItens, totalMateriais, itensEscolhidos };
}

function calcularMateriaisRecursivo(itemKey, quantidade, receitasUsadas) {
  const materiais = {};
  
  if (!receitasUsadas[itemKey]) {
    return materiais;
  }

  for (const [mat, qtd] of Object.entries(receitasUsadas[itemKey])) {
    if (mat === 'cripto') continue;
    
    const total = qtd * quantidade;
    
    // Se o material tem receita (é uma submatéria), calcular recursivamente
    if (receitasUsadas[mat]) {
      const subMateriais = calcularMateriaisRecursivo(mat, total, receitasUsadas);
      for (const [subMat, subQtd] of Object.entries(subMateriais)) {
        materiais[subMat] = (materiais[subMat] || 0) + subQtd;
      }
    } else {
      // É um material básico final
      materiais[mat] = (materiais[mat] || 0) + total;
    }
  }
  
  return materiais;
}

function calcularValorTotal(itensEscolhidos) {
  return itensEscolhidos.reduce((acc, item) => {
    const { quantidade, nome } = parseItemString(item);
    const itemKey = getItemKeyByNome(nome);
    return acc + quantidade * (DataStore.precos[itemKey] || 0);
  }, 0);
}
