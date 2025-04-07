let receitas, receitasComCripto, reciclaveis, precos, itens, categorias;

// Carregar dados do JSON
async function carregarDados() {
  receitas = await fetch("data/receitas.json").then((res) => res.json());
  receitasComCripto = await fetch("data/receitasComCripto.json").then((res) => res.json());
  reciclaveis = await fetch("data/reciclaveis.json").then((res) => res.json());
  precos = await fetch("data/precos.json").then((res) => res.json());
  itens = await fetch("data/itens.json").then((res) => res.json());
  categorias = await fetch("data/categorias.json").then((res) => res.json());
}

// Inicializar a aplicação
document.addEventListener("DOMContentLoaded", async () => {
  await carregarDados();
  gerarHTMLCategorias();
});

function resetar() {
  // Reset all input fields to 0
  document.querySelectorAll("input[type='number']").forEach(input => input.value = 0);

  // Hide and clear the result div
  const resultDiv = document.getElementById("result");
  if (resultDiv) {
    Object.assign(resultDiv.style, { display: "none" });
    resultDiv.innerHTML = "";
  }

  // Close all item containers
  document.querySelectorAll(".itens").forEach(div => div.style.display = "none");
}

function toggleCategoria(element) {
  const itens = element.querySelector(".itens");
  const isOpen = itens.style.display === "block";

  // Fecha todas as categorias
  document.querySelectorAll(".itens").forEach((div) => {
    div.style.display = "none";
  });

  // Abre a categoria clicada, se não estiver aberta
  itens.style.display = isOpen ? "none" : "block";
}

function gerarHTMLCategorias() {
  const container = document.getElementById("categorias-container");
  container.innerHTML = "";

  for (const [categoriaKey, categoria] of Object.entries(categorias)) {
    const itensCategoria = Object.entries(itens).filter(
      ([_, item]) => item.categoria === categoriaKey
    );

    if (itensCategoria.length > 0) {
      const categoriaDiv = document.createElement("div");
      categoriaDiv.className = "categoria";
      categoriaDiv.setAttribute("onclick", "toggleCategoria(this)");

      const categoriaHeader = document.createElement("h2");
      categoriaHeader.className = "categoria-header";
      categoriaHeader.innerHTML = `
                <img src="${categoria.ico}" alt="${categoria.nome}" class="categoria-ico" onerror="this.style.display='none'" />
                <span>${categoria.nome}</span>
            `;
      categoriaDiv.appendChild(categoriaHeader);

      const itensDiv = document.createElement("div");
      itensDiv.className = "itens";
      itensDiv.setAttribute("onclick", "event.stopPropagation()");

      itensCategoria.forEach(([itemKey, item]) => {
        const itemContainer = document.createElement("div");
        itemContainer.className = "item-container";

        const itemImage = document.createElement("img");
        itemImage.src = item.ico;
        itemImage.alt = item.nome;
        itemImage.className = "item-image";
        itemImage.onerror = function () {
          this.style.display = "none";
        };

        const itemLabel = document.createElement("label");
        itemLabel.innerHTML = `
                    ${item.nome} <br />
                    <input type="number" min="0" value="0" id="${itemKey}" />
                `;

        const informativo = document.createElement("p");
        informativo.className = "informativo";

        const materiais = receitas[itemKey]
          ? Object.entries(receitas[itemKey])
              .map(([mat, qtd]) => `${mat}: ${qtd}`)
              .join(", ")
          : "Receita não encontrada";

        const valorUnitario = precos[itemKey]
          ? ` (Valor Unitário: R$ ${precos[itemKey].toFixed(2)})`
          : "";
        informativo.textContent = `Cada ${item.nome} requer: ${materiais}${valorUnitario}`;

        itemContainer.appendChild(itemImage);
        itemContainer.appendChild(itemLabel);
        itemContainer.appendChild(informativo);

        itensDiv.appendChild(itemContainer);
      });

      categoriaDiv.appendChild(itensDiv);
      container.appendChild(categoriaDiv);
    }
  }
}

// Initialize the page by generating the HTML for categories
document.addEventListener("DOMContentLoaded", () => {
  gerarHTMLCategorias();
});

function calcular() {
  const usarCripto = document.getElementById("usar-cripto").checked;
  const receitasUsadas = usarCripto ? receitasComCripto : receitas;

  esconderCategorias();
  const { totalItens, totalMateriais, reciclado, itensEscolhidos } =
    calcularMateriaisEItens(receitasUsadas);

  if (totalItens === 0) {
    exibirMensagemNenhumItem();
    return;
  }

  const valorTotal = calcularValorTotal(itensEscolhidos);
  exibirResultado(totalItens, itensEscolhidos, totalMateriais, reciclado, valorTotal);
}

function esconderCategorias() {
  document.querySelectorAll(".itens").forEach((div) => (div.style.display = "none"));
}

function calcularMateriaisEItens(receitasUsadas) {
  let totalItens = 0;
  let totalMateriais = {};
  let reciclado = 0;
  let itensEscolhidos = [];

  for (const [itemKey, item] of Object.entries(itens)) {
    const inputElement = document.getElementById(itemKey);
    const quantidade = inputElement ? parseInt(inputElement.value) || 0 : 0;

    if (quantidade > 0) {
      itensEscolhidos.push(`${quantidade}x ${item.nome}`);
      totalItens += quantidade;

      if (receitasUsadas[itemKey]) {
        for (const [mat, qtd] of Object.entries(receitasUsadas[itemKey])) {
          const totalMat = qtd * quantidade;
          totalMateriais[mat] = (totalMateriais[mat] || 0) + totalMat;
          reciclado += totalMat * reciclaveis[mat];
        }
      }
    }
  }

  return { totalItens, totalMateriais, reciclado, itensEscolhidos };
}

function exibirMensagemNenhumItem() {
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
        <div class="alerta">
            <strong>Nenhum item selecionado</strong>
            <p>Informe ao menos 1 item para calcular os materiais necessários.</p>
        </div>
    `;
}

function calcularValorTotal(itensEscolhidos) {
  return itensEscolhidos.reduce((acc, item) => {
    const [quantidade, nome] = item.split("x").map((str) => str.trim());
    const itemKey = Object.keys(itens).find((key) => itens[key].nome === nome);
    return acc + parseInt(quantidade) * (precos[itemKey] || 0);
  }, 0);
}

function exibirResultado(totalItens, itensEscolhidos, totalMateriais, reciclado, valorTotal) {
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
        <h3>Relatório de Produção</h3>
        <p><strong>🛠️ Itens Produzidos:</strong></p>
        <ul>
         ${gerarListaItens(itensEscolhidos)} 
        </ul>
        <p><strong>📦 Total Geral:</strong> ${totalItens} itens</p>
        ${gerarTabelaMateriais(totalMateriais)}
        ${gerarResumoRecicladoEValor(reciclado, valorTotal)}
    `;
}

function gerarListaItens(itensEscolhidos) {
  return itensEscolhidos
    .map((item) => {
      const [quantidade, nome] = item.split("x").map((str) => str.trim());
      const itemKey = Object.keys(itens).find((key) => itens[key].nome === nome);
      const valorItem = parseInt(quantidade) * (precos[itemKey] || 0);
      return `<li>${item} - $ ${valorItem.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</li>`;
    })
    .join("");
}

function gerarTabelaMateriais(totalMateriais) {
  const materialNomes = {
    cobalto: "Cobalto",
    aco: "Aço",
    aluminioNaval: "Alumínio Naval",
    polietileno: "Polietileno",
    borrachaFluorada: "Borracha Fluorada",
    titanio: "Titânio",
    vidroTemperado: "Vidro Temperado",
    cripto: "Cripto",
  };

  let tableHTML = `
        <table class="result-table">
            <tr>
                <th>Material</th>
                <th>Quantidade</th>
            </tr>
    `;

  for (let mat in totalMateriais) {
    const nomeMaterial = materialNomes[mat] || mat;
    tableHTML += `
            <tr>
                <td>${nomeMaterial}</td>
                <td>${totalMateriais[mat]}</td>
            </tr>
        `;
  }

  tableHTML += `</table>`;
  return tableHTML;
}

function gerarResumoRecicladoEValor(reciclado, valorTotal) {
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
