import { DataStore } from "../domain/materiaisService.js";
import { gerarListaItens, gerarTabelaMateriais, gerarResumoRecicladoEValor } from "./formatador.js";

export function calcular() {
  const usarCripto = document.getElementById("usar-cripto").checked;
  const receitasUsadas = usarCripto ? DataStore.receitasComCripto : DataStore.receitas;

  esconderCategorias();
  const { totalItens, totalMateriais, reciclado, itensEscolhidos } = calcularMateriaisEItens(receitasUsadas);

  const resultDiv = document.getElementById("result");

  if (totalItens === 0) {
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="alerta">
        <strong>Nenhum item selecionado</strong>
        <p>Informe ao menos 1 item para calcular os materiais necessários.</p>
      </div>`;
    return;
  }

  const valorTotal = calcularValorTotal(itensEscolhidos);
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <h3>Relatório de Produção</h3>
    <p><strong>🛠️ Itens Produzidos:</strong></p>
    <ul>${gerarListaItens(itensEscolhidos)}</ul>
    <p><strong>📦 Total Geral:</strong> ${totalItens} itens</p>
    ${gerarTabelaMateriais(totalMateriais)}
    ${gerarResumoRecicladoEValor(reciclado, valorTotal)}
  `;
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
  let reciclado = 0;
  const itensEscolhidos = [];

  for (const [itemKey, item] of Object.entries(DataStore.itens)) {
    const input = document.getElementById(itemKey);
    const quantidade = input ? parseInt(input.value) || 0 : 0;

    if (quantidade > 0) {
      itensEscolhidos.push(`${quantidade}x ${item.nome}`);
      totalItens += quantidade;

      if (receitasUsadas[itemKey]) {
        for (const [mat, qtd] of Object.entries(receitasUsadas[itemKey])) {
          const total = qtd * quantidade;
          totalMateriais[mat] = (totalMateriais[mat] || 0) + total;
          reciclado += total * (DataStore.reciclaveis[mat] || 0);
        }
      }
    }
  }

  return { totalItens, totalMateriais, reciclado, itensEscolhidos };
}

function calcularValorTotal(itensEscolhidos) {
  return itensEscolhidos.reduce((acc, item) => {
    const [quantidade, nome] = item.split("x").map(str => str.trim());
    const itemKey = Object.keys(DataStore.itens).find(key => DataStore.itens[key].nome === nome);
    return acc + parseInt(quantidade) * (DataStore.precos[itemKey] || 0);
  }, 0);
}
