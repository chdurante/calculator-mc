export const DataStore = {
  receitas: {},
  precos: {},
  precosParceria: {},
  itens: {},
  categorias: {}
};

export async function carregarDados() {
  const arquivos = [
    ["receitas", "receitas.json"],
    ["precos", "precos.json"],
    ["precosParceria", "precosParceria.json"],
    ["itens", "itens.json"],
    ["categorias", "categorias.json"]
  ];

  await Promise.all(
    arquivos.map(async ([chave, arquivo]) => {
      DataStore[chave] = await fetch(`data/${arquivo}`).then(res => res.json());
    })
  );
}

