import { DataStore } from "../domain/materiaisService.js";

export function gerarUICompra() {
  const container = document.getElementById("compra-container");
  container.innerHTML = "";

  DataStore.itensCompra.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item-compra";
    div.innerHTML = `
      <label>
        ${item.nome} - R$${item.valor.toFixed(2)} | ${item.material} materiais
        <input type="number" min="0" data-index="${index}" placeholder="Qtd a trocar" />
      </label>
    `;
    container.appendChild(div);
  });

  document.getElementById("btn-calcular-compra").addEventListener("click", calcularRetornoCompra);
  document.getElementById("btn-resetar-compra").addEventListener("click", resetarCompra);
}

export function calcularRetornoCompra() {
    const inputs = document.querySelectorAll("#compra-container input");
    let totalMaterial = 0;
    let totalDinheiro = 0;
    let algumaQuantidadeInformada = false;
  
    const retornoPorItem = [];
  
    inputs.forEach((input) => {
      const qtd = parseInt(input.value);
      const item = DataStore.itensCompra[parseInt(input.dataset.index)];
  
      if (!isNaN(qtd) && qtd > 0) {
        algumaQuantidadeInformada = true;
  
        const material = qtd * item.material;
        const dinheiro = qtd * item.valor;
  
        totalMaterial += material;
        totalDinheiro += dinheiro;
  
        retornoPorItem.push({
          nome: item.nome,
          qtd,
          material,
          dinheiro,
        });
      }
    });
  
    const resultado = document.getElementById("compra-resultado");
  
    if (!algumaQuantidadeInformada) {
      resultado.style.display = "block";
      resultado.innerHTML = `
        <div class="alerta">
          <strong>Nenhuma quantidade informada</strong>
          <p>Informe ao menos 1 item para calcular o retorno da troca.</p>
        </div>`;
      return;
    }
  
    resultado.style.display = "block";
    resultado.innerHTML = `
  <h3>📦 <strong>RELATÓRIO DE RETORNO</strong></h3>

  <ul class="lista-itens">
    ${retornoPorItem.map(item => `<li>🔹 ${item.qtd}x ${item.nome} - ${item.material} Materiais ou R$${item.dinheiro.toFixed(2)}</li>`).join("")}
  </ul>

  <div class="resultado-retorno">
    <div class="bloco-info">
      <span class="titulo">⚙️ Materiais se Trocar:</span>
      <span class="valor">${totalMaterial} materiais</span>
    </div>
    <div class="bloco-info verde">
      <span class="titulo">💰 Dinheiro se Vender:</span>
      <span class="valor">R$${totalDinheiro.toFixed(2)}</span>
    </div>
  </div>
`;


  }
  
  

  export function resetarCompra() {
    document.querySelectorAll("#compra-container input").forEach((input) => {
      input.value = "";
    });
  
    const resultado = document.getElementById("compra-resultado");
  
    if (resultado) {
      resultado.innerHTML = "";
      resultado.style.display = "none";
    }
  }
  
