import { DataStore } from "../domain/materiaisService.js";

const materialNomes = {
  // Materiais básicos
  metal: "Metal",
  sucata: "Sucata",
  plastico: "Plástico",
  borracha: "Borracha",
  molas: "Molas",
  pregos: "Pregos",
  fiosCobre: "Fios de Cobre",
  pecasEletronicas: "Peças Eletrônicas",
  vidros: "Vidros",
  garrafasVazias: "Garrafas Vazias",
  colas: "Colas",
  superColas: "Super Colas",
  baterias: "Baterias",
  latinhasVazias: "Latinhas Vazias",
  couros: "Couros",
  roupasSujas: "Roupas Sujas",
  cripto: "Cripto",
  // Submatérias
  lingoteAco: "Lingote de Aço",
  blocoPolimero: "Bloco de Polímero",
  tirasCouro: "Tiras de Couro",
  adesivoIndustrial: "Adesivo Industrial",
  conjuntoMolas: "Conjunto de Molas",
  carretelCobre: "Carretel de Cobre",
  oleoSolvente: "Óleo de Solvente",
  poVidro: "Pó de Vidro",
  // C4 e submateriais
  c4: "C4",
  carcacaCarga: "Carcaça de Carga",
  compostoInerte: "Composto Inerte",
  timerSimples: "Timer Simples",
  placaPlastico: "Placa de Plástico",
  matrizCarcaca: "Matriz de Carcaça",
  circuitoSimples: "Circuito Simples",
  caixaMedicaPequena: "Caixa Médica Pequena",
  argila: "Argila",
  pedacoKevlar: "Pedaço de Kevlar"
};

export function gerarListaItens(itensEscolhidos) {
  return itensEscolhidos.map(item => {
    const [quantidade, nome] = item.split("x").map(str => str.trim());
    const itemKey = Object.keys(DataStore.itens).find(key => DataStore.itens[key].nome === nome);
    const valorItem = parseInt(quantidade) * (DataStore.precos[itemKey] || 0);

    // Só exibir valor se for maior que zero
    if (valorItem > 0) {
      return `<li>🔹${item} - $ ${valorItem.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</li>`;
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

  // Para cada item escolhido, mostrar sua hierarquia
  itensEscolhidos.forEach(item => {
    const [quantidade, nome] = item.split("x").map(str => str.trim());
    const itemKey = Object.keys(DataStore.itens).find(key => DataStore.itens[key].nome === nome);
    
    if (!itemKey || !receitasUsadas[itemKey]) return;

    html += `
      <div class="item-hierarquia">
        <h4>🔫 ${nome} (${quantidade}x)</h4>
        <div class="nivel-1">
          <h5>📦 Materiais necessários:</h5>
          <ul>
    `;

    // Mostrar submatérias diretas
    Object.entries(receitasUsadas[itemKey]).forEach(([mat, qtd]) => {
      if (mat === 'cripto') return;
      const totalQtd = qtd * parseInt(quantidade);
      const nomeMat = materialNomes[mat] || DataStore.itens[mat]?.nome || mat;
      html += `<li>${nomeMat}: ${totalQtd}</li>`;
    });

    html += `</ul></div>`;

    // Verificar se há submateriais para exibir
    const temSubmateriais = Object.entries(receitasUsadas[itemKey]).some(([mat, qtd]) => 
      mat !== 'cripto' && receitasUsadas[mat]
    );

    if (temSubmateriais) {
      // Mostrar como cada submatéria é feita
      html += `<div class="nivel-2"><h5>🔧 Submatérias:</h5>`;
      
      Object.entries(receitasUsadas[itemKey]).forEach(([mat, qtd]) => {
        if (mat === 'cripto' || !receitasUsadas[mat]) return;
        
        const totalQtd = qtd * parseInt(quantidade);
        const nomeMat = materialNomes[mat] || DataStore.itens[mat]?.nome || mat;
        
        html += `
          <div class="submaterial">
            <strong>${nomeMat} (${totalQtd}x):</strong>
            <ul>
        `;
        
        Object.entries(receitasUsadas[mat]).forEach(([subMat, subQtd]) => {
          if (subMat === 'cripto') return;
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
  // Só exibir valor total se for maior que zero
  if (valorTotal > 0) {
    return `
      <div class="flex-container">
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
  
  return '';
}

export function traduzirMaterial(key) {
  return materialNomes[key] || key;
}