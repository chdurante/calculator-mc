import { DataStore } from "../domain/materiaisService.js";
import { criarElementoComHTML } from "./domUtils.js";
import { traduzirMaterial } from "../core/formatador.js";


export function gerarHTMLCategorias() {
  const container = document.getElementById("categorias-container");
  container.innerHTML = "";

  Object.entries(DataStore.categorias).forEach(([categoriaKey, categoria]) => {
    const itensCategoria = Object.entries(DataStore.itens).filter(
      ([_, item]) => item.categoria === categoriaKey
    );

    if (!itensCategoria.length) return;

    const categoriaDiv = document.createElement("div");
    categoriaDiv.className = "categoria";
    categoriaDiv.addEventListener("click", () => toggleCategoria(categoriaDiv));

    const headerHTML = `
      <img src="${categoria.ico}" alt="${categoria.nome}" class="categoria-ico" onerror="this.style.display='none'" />
      <span>${categoria.nome}</span>`;
    const categoriaHeader = criarElementoComHTML("h2", headerHTML, "categoria-header");

    const itensDiv = document.createElement("div");
    itensDiv.className = "itens";
    itensDiv.addEventListener("click", e => e.stopPropagation());

    itensCategoria.forEach(([itemKey, item]) => {
      const itemContainer = document.createElement("div");
      itemContainer.className = "item-container";

      const inputHTML = `${item.nome} <br /><input type="number" min="0" value="0" id="${itemKey}" />`;
      const itemLabel = criarElementoComHTML("label", inputHTML);

      const itemImage = document.createElement("img");
      Object.assign(itemImage, {
        src: item.ico,
        alt: item.nome,
        className: "item-image",
        onerror: () => (itemImage.style.display = "none")
      });

      const materiais = DataStore.receitas[itemKey]
  ? Object.entries(DataStore.receitas[itemKey])
      .map(([mat, qtd]) => `${traduzirMaterial(mat)}: ${qtd}`)
      .join(", ")
  : "Receita não encontrada";


      const valorUnitario = DataStore.precos[itemKey]
        ? ` (Valor Unitário: R$ ${DataStore.precos[itemKey].toFixed(2)})`
        : "";

      const informativo = document.createElement("p");
      informativo.className = "informativo";
      informativo.textContent = `Cada ${item.nome} requer: ${materiais}${valorUnitario}`;

      itemContainer.append(itemImage, itemLabel, informativo);
      itensDiv.appendChild(itemContainer);
    });

    categoriaDiv.append(categoriaHeader, itensDiv);
    container.appendChild(categoriaDiv);
  });
}

function toggleCategoria(element) {
  const itens = element.querySelector(".itens");
  const isOpen = itens.style.display === "block";

  document.querySelectorAll(".itens").forEach(div => (div.style.display = "none"));
  itens.style.display = isOpen ? "none" : "block";
}
