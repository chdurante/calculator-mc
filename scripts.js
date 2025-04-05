function resetar() {
  // Limpa os valores dos inputs dinamicamente
  document
    .querySelectorAll("input[type='number']")
    .forEach((input) => (input.value = 0));

  // Esconde o resultado
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "none";
  resultDiv.innerHTML = "";

  // Fecha todas as categorias
  document
    .querySelectorAll(".itens")
    .forEach((div) => (div.style.display = "none"));
}

function toggleCategoria(element) {
  const itens = element.querySelector(".itens");
  const isOpen = itens.style.display === "block";
  document
    .querySelectorAll(".itens")
    .forEach((div) => (div.style.display = "none"));
  if (!isOpen) {
    itens.style.display = "block";
  }
}

const receitas = {
  // Pistolas
  beretta: {
    cobalto: 35,
    aco: 30,
    aluminioNaval: 25,
    polietileno: 35,
    cripto: 0,
  },
  ruger: {
    cobalto: 50,
    aco: 45,
    aluminioNaval: 35,
    polietileno: 45,
    cripto: 0,
  },
  revolver: {
    cobalto: 65,
    aco: 55,
    aluminioNaval: 45,
    polietileno: 60,
    cripto: 0,
  },
  pistola50: {
    cobalto: 90,
    aco: 70,
    aluminioNaval: 55,
    polietileno: 85,
    cripto: 0,
  },

  // Submetralhadoras
  uzi: {
    cobalto: 120,
    aco: 100,
    aluminioNaval: 85,
    polietileno: 115,
    cripto: 0,
  },
  evo: {
    cobalto: 120,
    aco: 100,
    aluminioNaval: 85,
    polietileno: 115,
    cripto: 0,
  },
  krv: {
    cobalto: 120,
    aco: 100,
    aluminioNaval: 85,
    polietileno: 115,
    cripto: 0,
  },
  akcompacta: {
    cobalto: 120,
    aco: 100,
    aluminioNaval: 85,
    polietileno: 115,
    cripto: 0,
  },
  doze: {
    cobalto: 280,
    aco: 240,
    aluminioNaval: 240,
    polietileno: 260,
    cripto: 0,
  },

  // Fuzis
  ak47: {
    cobalto: 160,
    aco: 150,
    aluminioNaval: 130,
    polietileno: 160,
    cripto: 0,
  },
  scar: {
    cobalto: 160,
    aco: 150,
    aluminioNaval: 130,
    polietileno: 160,
    cripto: 0,
  },

  // Attachments
  silenciador: {
    polietileno: 100,
    borrachaFluorada: 100,
    cobalto: 100,
    aluminioNaval: 100,
  },
  silenciadorHeavy: {
    polietileno: 200,
    borrachaFluorada: 200,
    cobalto: 200,
    aluminioNaval: 200,
  },
  penteEstendidoPistola: { borrachaFluorada: 20, titanio: 20, cobalto: 20 },
  penteEstendidoSMG: { borrachaFluorada: 40, titanio: 40, cobalto: 40 },
  lanternaTatica: {
    polietileno: 5,
    borrachaFluorada: 5,
    cobalto: 5,
    vidroTemperado: 5,
    titanio: 5,
  },

  // Outros
  molotov: { aco: 40, cobalto: 40, aluminioNaval: 80, polietileno: 40 },
};

const receitasComCripto = {
  // Pistolas
  beretta: {
    cobalto: 25,
    aco: 20,
    aluminioNaval: 15,
    polietileno: 25,
    cripto: 4,
  },
  ruger: {
    cobalto: 40,
    aco: 35,
    aluminioNaval: 25,
    polietileno: 35,
    cripto: 4,
  },
  revolver: {
    cobalto: 55,
    aco: 45,
    aluminioNaval: 35,
    polietileno: 50,
    cripto: 4,
  },
  pistola50: {
    cobalto: 80,
    aco: 60,
    aluminioNaval: 45,
    polietileno: 75,
    cripto: 4,
  },

  // Submetralhadoras
  uzi: {
    cobalto: 110,
    aco: 90,
    aluminioNaval: 75,
    polietileno: 105,
    cripto: 8,
  },
  evo: {
    cobalto: 110,
    aco: 90,
    aluminioNaval: 75,
    polietileno: 105,
    cripto: 8,
  },
  krv: {
    cobalto: 110,
    aco: 90,
    aluminioNaval: 75,
    polietileno: 105,
    cripto: 8,
  },
  akcompacta: {
    cobalto: 110,
    aco: 90,
    aluminioNaval: 75,
    polietileno: 105,
    cripto: 8,
  },
  doze: {
    cobalto: 270,
    aco: 230,
    aluminioNaval: 230,
    polietileno: 250,
    cripto: 8,
  },

  // Fuzis
  ak47: {
    cobalto: 150,
    aco: 140,
    aluminioNaval: 120,
    polietileno: 150,
    cripto: 8,
  },
  scar: {
    cobalto: 150,
    aco: 140,
    aluminioNaval: 120,
    polietileno: 150,
    cripto: 8,
  },

  // Attachments
  silenciador: {
    polietileno: 100,
    borrachaFluorada: 100,
    cobalto: 100,
    aluminioNaval: 100,
  },
  silenciadorHeavy: {
    polietileno: 200,
    borrachaFluorada: 200,
    cobalto: 200,
    aluminioNaval: 200,
  },
  penteEstendidoPistola: { borrachaFluorada: 20, titanio: 20, cobalto: 20 },
  penteEstendidoSMG: { borrachaFluorada: 40, titanio: 40, cobalto: 40 },
  lanternaTatica: {
    polietileno: 5,
    borrachaFluorada: 5,
    cobalto: 5,
    vidroTemperado: 5,
    titanio: 5,
  },

  // Outros
  molotov: { aco: 40, cobalto: 40, aluminioNaval: 80, polietileno: 40 },
};

const reciclaveis = {
  cobalto: 7.86,
  aco: 7.86,
  aluminioNaval: 7.86,
  polietileno: 7.86,
  borrachaFluorada: 7.86,
  titanio: 7.86,
  vidroTemperado: 7.86,
  cripto: 0, // Ensure all materials, including 'cripto', have a value
};

const precos = {
  // Pistolas
  beretta: 8000,
  ruger: 11000,
  revolver: 14000,
  pistola50: 18000,

  // Submetralhadoras
  uzi: 33000,
  evo: 34000,
  akcompacta: 40000,
  krv: 44000,
  doze: 45000,

  // Fuzis
  ak47: 45000,
  scar: 48000,

  // Attachments
  silenciador: 15000,
  silenciadorHeavy: 25000,
  penteEstendidoPistola: 4000,
  penteEstendidoSMG: 5000,
  lanternaTatica: 1000,

  // Outros
  molotov: 10000,
};

const itens = {
  // Pistolas
  beretta: {
    nome: "Beretta",
    categoria: "pistolas",
    ico: "images/beretta.png",
  },
  ruger: { nome: "Ruger", categoria: "pistolas", ico: "images/ruger.png" },
  revolver: {
    nome: "Revólver",
    categoria: "pistolas",
    ico: "images/revolver.png",
  },
  pistola50: {
    nome: "Pistola .50",
    categoria: "pistolas",
    ico: "images/pistola50.png",
  },

  // Submetralhadoras
  uzi: { nome: "Uzi", categoria: "subs", ico: "images/uzi.png" },
  evo: { nome: "EVO", categoria: "subs", ico: "images/evo.png" },
  akcompacta: {
    nome: "AK Compacta",
    categoria: "subs",
    ico: "images/akcompacta.png",
  },
  krv: { nome: "KRV", categoria: "subs", ico: "images/krv.png" },
  doze: { nome: "Doze", categoria: "subs", ico: "images/doze.png" },

  // Fuzis
  ak47: { nome: "AK-47", categoria: "fuzis", ico: "images/ak47.png" },
  scar: { nome: "SCAR-H", categoria: "fuzis", ico: "images/scar.png" },

  // Attachments
  silenciador: {
    nome: "Silenciador",
    categoria: "attachments",
    ico: "images/silenciador.png",
  },
  silenciadorHeavy: {
    nome: "Silenciador Heavy",
    categoria: "attachments",
    ico: "images/silenciadorHeavy.png",
  },
  penteEstendidoPistola: {
    nome: "Pente Estendido Pistola",
    categoria: "attachments",
    ico: "images/penteEstendidoPistola.png",
  },
  penteEstendidoSMG: {
    nome: "Pente Estendido SMG",
    categoria: "attachments",
    ico: "images/penteEstendidoSMG.png",
  },
  lanternaTatica: {
    nome: "Lanterna Tática",
    categoria: "attachments",
    ico: "images/lanternaTatica.png",
  },

  // Outros
  molotov: { nome: "Molotov", categoria: "outros", ico: "images/molotov.png" },
};

const categorias = {
  pistolas: { nome: "Pistolas", ico: "images/pistolas.png" },
  subs: { nome: "Submetralhadoras", ico: "images/subs.png" },
  fuzis: { nome: "Fuzis", ico: "images/fuzis.png" },
  attachments: { nome: "Attachments", ico: "images/attachments.png" },
  outros: { nome: "Outros", ico: "images/outros.png" },
};

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
      categoriaHeader.style.cssText =
        "display: flex; align-items: center; justify-content: center; gap: 8px; text-align: center;";
      categoriaHeader.innerHTML = `
                <img src="${categoria.ico}" alt="${categoria.nome}" class="categoria-ico" style="width: 32px; height: 32px;" onerror="this.style.display='none'" />
                <span>${categoria.nome}</span>
            `;
      categoriaDiv.appendChild(categoriaHeader);

      const itensDiv = document.createElement("div");
      itensDiv.className = "itens";
      itensDiv.setAttribute("onclick", "event.stopPropagation()");

      itensCategoria.forEach(([itemKey, item]) => {
        const itemContainer = document.createElement("div");
        itemContainer.className = "item-container";
        itemContainer.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background-color: rgba(255, 255, 255, 0.1);
                    padding: 10px;
                    border-radius: 8px;
                    margin: 10px;
                `;

        const itemImage = document.createElement("img");
        itemImage.src = item.ico;
        itemImage.alt = item.nome;
        itemImage.style.cssText =
          "width: 48px; height: 48px; margin-bottom: 8px;";
        itemImage.onerror = function () {
          this.style.display = "none";
        };

        const itemLabel = document.createElement("label");
        itemLabel.style.cssText = "text-align: center;";
        itemLabel.innerHTML = `
                    ${item.nome} <br />
                    <input type="number" min="0" value="0" id="${itemKey}" />
                `;

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

        const informativo = document.createElement("p");
        informativo.className = "informativo";
        informativo.style.cssText =
          "text-align: center; font-size: 12px; margin-top: 8px;";

        const materiais = receitas[itemKey]
          ? Object.entries(receitas[itemKey])
              .map(([mat, qtd]) => {
                const nomeMaterial =
                  materialNomes[mat] ||
                  mat.charAt(0).toUpperCase() + mat.slice(1);
                return `${qtd} ${nomeMaterial}`;
              })
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

// Call the function to generate the HTML on page load
document.addEventListener("DOMContentLoaded", gerarHTMLCategorias);

function calcular() {
  const usarCripto = document.getElementById("usar-cripto").checked;
  const receitasUsadas = usarCripto ? receitasComCripto : receitas; // Usa a receita correta

  document
    .querySelectorAll(".itens")
    .forEach((div) => (div.style.display = "none"));

  let totalItens = 0;
  let total = {};
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
          total[mat] = (total[mat] || 0) + totalMat;
          reciclado += totalMat * reciclaveis[mat];
        }
      }
    }
  }

  if (totalItens === 0) {
    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
            <div class="alerta">
                <strong>Nenhum item selecionado</strong>
                <p>Informe ao menos 1 item para calcular os materiais necessários.</p>
            </div>
        `;
    return;
  }

  const valorTotal = itensEscolhidos.reduce((acc, item) => {
    const [quantidade, nome] = item.split("x").map((str) => str.trim());
    const itemKey = Object.keys(itens).find((key) => itens[key].nome === nome);
    return acc + parseInt(quantidade) * (precos[itemKey] || 0);
  }, 0);

  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
        <h3>Relatório de Produção</h3>
        <p><strong>🛠️ Itens Produzidos:</strong></p>
        <ul>
            ${itensEscolhidos.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <p><strong>📦 Total Geral:</strong> ${totalItens} itens</p>
    `;

  let tableHTML = `
        <table class="result-table">
            <tr>
                <th>Material</th>
                <th>Quantidade</th>
            </tr>
    `;

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

  for (let mat in total) {
    const nomeMaterial = materialNomes[mat] || mat;
    tableHTML += `
            <tr>
                <td>${nomeMaterial}</td>
                <td>${total[mat]}</td>
            </tr>
        `;
  }

  tableHTML += `</table>`;
  resultDiv.innerHTML += tableHTML;

  resultDiv.innerHTML += `
        <div style="display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; margin-top: 20px; gap: 20px;">
            <div style="text-align: center; background-color: #111; padding: 12px 20px; border-radius: 10px; border: 2px solid #FFD700;">
                <h4 style="margin-bottom: 8px; color: #FFD700;">⚙️ Materiais Recicláveis</h4>
                <p style="font-size: 18px; font-weight: bold; color: #FFD700;">${Math.ceil(
                  reciclado
                ).toLocaleString("pt-BR")}</p>
            </div>
            <div style="text-align: center; background-color: #111; padding: 12px 20px; border-radius: 10px; border: 2px solid #00ff99;">
                <h4 style="margin-bottom: 8px; color: #00ff99;">💰 Valor Total</h4>
                <p style="font-size: 18px; font-weight: bold; color: #00ff99;">R$ ${valorTotal.toLocaleString(
                  "pt-BR",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}</p>
            </div>
        </div>
    `;
}
